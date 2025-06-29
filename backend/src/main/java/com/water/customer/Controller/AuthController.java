package com.water.customer.Controller;

import com.water.customer.DTO.AuthRequestDTO;
import com.water.customer.DTO.AuthResponseDTO;
import com.water.customer.DTO.CustomerSignupDTO;
import com.water.customer.DTO.StaffSignupDTO;
import com.water.customer.Entity.user;
import com.water.customer.Service.JWTUtils;
import com.water.customer.Service.managementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

// com.water.customer.controller.AuthController.java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final managementService userSvc;
    private final JWTUtils jwtUtils;
    private final AuthenticationManager authManager;

    @PostMapping("/register/customer")
    public ResponseEntity<?> registerCustomer(@RequestBody CustomerSignupDTO dto) {
        Map<String, Object> resp = new HashMap<>();
        try {
            userSvc.registerCustomer(dto);
            resp.put("message", "Customer registered successfully!");
            resp.put("statusCode", 200);
            resp.put("success", true);
            return ResponseEntity.ok(resp);
        } catch (IllegalArgumentException ex) {
            resp.put("message", ex.getMessage());
            resp.put("statusCode", 400);
            resp.put("success", false);
            return ResponseEntity.badRequest().body(resp);
        } catch (Exception ex) {
            resp.put("message", "Unexpected server error.");
            resp.put("statusCode", 500);
            resp.put("success", false);
            return ResponseEntity.status(500).body(resp);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register/staff")
    public ResponseEntity<?> registerStaff(@RequestBody StaffSignupDTO dto) {
        userSvc.registerStaff(dto);
        return ResponseEntity.ok(Map.of("message","Staff registered"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody AuthRequestDTO req) {
        // authenticate
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        // load user
        user u = userSvc.findByEmail(req.getEmail());
        // build response
        Integer acct = userSvc.getAccountNoIfCustomer(u);
        String token = jwtUtils.generateToken(u, acct);
        String refresh = jwtUtils.generateRefreshToken(new HashMap<>(), u);

        AuthResponseDTO resp = AuthResponseDTO.builder()
                .statusCode(200)
                .token(token)
                .refreshToken(refresh)
                .role(u.getRole().name())
                .username(userSvc.getUsername(u))
                .accountNo(acct)
                .message("Login successful")
                .build();

        return ResponseEntity.ok(resp);
    }
}

