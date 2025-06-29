package com.water.customer.Service;

import com.water.customer.DTO.CustomerSignupDTO;
import com.water.customer.DTO.StaffSignupDTO;
import com.water.customer.Entity.societyofficer;
import com.water.customer.Entity.user;
import com.water.customer.Entity.usercustomer;
import com.water.customer.Repository.societyofficerRepository;
import com.water.customer.Repository.userRepository;
import com.water.customer.Repository.usercustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.EnumSet;

// com.water.customer.Service.UsermanagementService.java
@Service
@RequiredArgsConstructor
public class managementService {
    private final userRepository userRepo;
    private final usercustomerRepository custRepo;
    private final societyofficerRepository officerRepo;
    private final PasswordEncoder passwordEncoder;

    public void registerCustomer(CustomerSignupDTO dto) {
        if (userRepo.findByEmail(dto.getEmail()) != null)
            throw new IllegalArgumentException("Email in use");
        user u = new user();
        u.setEmail(dto.getEmail());
        u.setPassword(passwordEncoder.encode(dto.getPassword()));
        u.setRole(user.Role.CUSTOMER);
        user saved = userRepo.save(u);

        usercustomer c = new usercustomer();
        c.setAccountNo(dto.getAccountNo());
        c.setUsername(dto.getUsername());
        c.setUser(saved);
        custRepo.save(c);
    }

    public void registerStaff(StaffSignupDTO dto) {
        if (userRepo.findByEmail(dto.getEmail()) != null)
            throw new IllegalArgumentException("Email in use");
        // only allow ADMIN, CASHIER or SOCIETY_OFFICER
        if (!EnumSet.of(user.Role.ADMIN, user.Role.CASHIER, user.Role.SOCIETY_OFFICER)
                .contains(dto.getRole()))
            throw new IllegalArgumentException("Invalid staff role");

        user u = new user();
        u.setEmail(dto.getEmail());
        u.setPassword(passwordEncoder.encode(dto.getPassword()));
        u.setRole(dto.getRole());
        user saved = userRepo.save(u);

        societyofficer off = new societyofficer();
        off.setUsername(dto.getUsername());
        off.setUser(saved);
        officerRepo.save(off);

    }

    public user findByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    public Integer getAccountNoIfCustomer(user u) {
        if (u.getRole() != user.Role.CUSTOMER) return null;
        usercustomer uc = custRepo.findByUser(u);
        return uc.getAccountNo();
    }

    public String getUsername(user u) {
        if (u.getRole() == user.Role.CUSTOMER) {
            return custRepo.findByUser(u).getUsername();
        } else {
            return officerRepo.findByUser(u).getUsername();
        }
    }
}
