package com.water.customer.Service;

import com.water.customer.DTO.RequestResponse;
import com.water.customer.Entity.societyofficer;
import com.water.customer.Entity.user;
import com.water.customer.Entity.usercustomer;
import com.water.customer.Repository.userRepository;
import com.water.customer.Repository.usercustomerRepository;
import com.water.customer.Repository.societyofficerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Optional;

@Service
public class UsermanagementService {

    @Autowired
    private userRepository userRepo;

    @Autowired
    private usercustomerRepository usercustomerRepo;

    @Autowired
    private societyofficerRepository societyofficerRepo;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public RequestResponse register(RequestResponse requestResponse) {
        RequestResponse response = new RequestResponse();

        try {
            user newUser = new user();
            newUser.setEmail(requestResponse.getEmail());
            newUser.setPassword(passwordEncoder.encode(requestResponse.getPassword()));

            if (requestResponse.getAccountNo() != null) {
                newUser.setRole(com.water.customer.Entity.user.Role.CUSTOMER);
            } else {
                newUser.setRole(com.water.customer.Entity.user.Role.SOCIETY_OFFICER);
            }

            user savedUser = userRepo.save(newUser);

            if (savedUser.getRole() == com.water.customer.Entity.user.Role.CUSTOMER) {
                usercustomer ucustomer = new usercustomer();
                ucustomer.setAccountNo(requestResponse.getAccountNo());
                ucustomer.setUsername(requestResponse.getUsername());
                ucustomer.setUser(savedUser);
                usercustomerRepo.save(ucustomer);
            } else if (savedUser.getRole() == com.water.customer.Entity.user.Role.SOCIETY_OFFICER) {
                societyofficer officer = new societyofficer();
                officer.setUsername(requestResponse.getUsername());
                officer.setUser(savedUser);
                societyofficerRepo.save(officer);
            }

            if (savedUser.getUser_id() > 0) {
                response.setUser(savedUser);
                response.setStatusCode(200);
                response.setMessage("User registered successfully");
            }

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError("Error registering user: " + e.getMessage());
        }

        return response;
    }

    public RequestResponse login(RequestResponse loginRequest) {
        RequestResponse loginResponse = new RequestResponse();
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            Optional<user> optionalUser = Optional.ofNullable(userRepo.findByEmail(loginRequest.getEmail()));

            if (optionalUser.isEmpty()) {
                loginResponse.setStatusCode(401);
                loginResponse.setError("Invalid email or password");
                return loginResponse;
            }

            user loggedInUser = optionalUser.get();

            Integer accountNo = null;
            if (loggedInUser.getRole() == com.water.customer.Entity.user.Role.CUSTOMER) {
                Optional<usercustomer> customerOpt = Optional.ofNullable(usercustomerRepo.findByUser(loggedInUser));
                if (customerOpt.isPresent()) {
                    accountNo = customerOpt.get().getAccountNo();
                    usercustomer customer = customerOpt.get();
                    loginResponse.setUsername(customer.getUsername());
                    loginResponse.setAccountNo(accountNo); // Set Account Number for Customers
                }
            } else if (loggedInUser.getRole() == com.water.customer.Entity.user.Role.SOCIETY_OFFICER) {
                Optional<societyofficer> officerOpt = Optional.ofNullable(societyofficerRepo.findByUser(loggedInUser));
                if (officerOpt.isPresent()) {
                    societyofficer officer = officerOpt.get();
                    loginResponse.setUsername(officer.getUsername()); // Set Username for Society Officers
                }
            }

            var jwt = jwtUtils.generateToken(loggedInUser,accountNo);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), loggedInUser);

            loginResponse.setStatusCode(200);
            loginResponse.setToken(jwt);
            loginResponse.setRefreshToken(refreshToken);
            loginResponse.setMessage("Login successful");
            loginResponse.setExpirationTime("24Hrs");
            loginResponse.setRole(loggedInUser.getRole().name());

        } catch (Exception e) {
            loginResponse.setStatusCode(500);
            loginResponse.setError("Login failed: " + e.getMessage());
        }
        return loginResponse;
    }
}
