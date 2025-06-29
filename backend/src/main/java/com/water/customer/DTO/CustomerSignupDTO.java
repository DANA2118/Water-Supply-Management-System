package com.water.customer.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerSignupDTO {
    private String email;
    private String password;
    private Integer accountNo;
    private String username;
}
