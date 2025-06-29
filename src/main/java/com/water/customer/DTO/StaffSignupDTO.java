package com.water.customer.DTO;

import com.water.customer.Entity.user;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StaffSignupDTO {
    private String email;
    private String password;
    private String username;
    private user.Role role;
}
