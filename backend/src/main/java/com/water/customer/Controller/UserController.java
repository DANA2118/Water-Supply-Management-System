package com.water.customer.Controller;


import com.water.customer.DTO.RequestResponse;
import com.water.customer.Service.UsermanagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    @Autowired
    private UsermanagementService usermanagementService;

    @PostMapping("/auth/register")
    public ResponseEntity<RequestResponse> register(@RequestBody RequestResponse requestResponse) {
        return ResponseEntity.ok(usermanagementService.register(requestResponse));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<RequestResponse> login(@RequestBody RequestResponse loginRequest) {
        return ResponseEntity.ok(usermanagementService.login(loginRequest));
    }
}
