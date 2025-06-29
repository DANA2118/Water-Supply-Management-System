package com.water.customer.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponseDTO {
    private int statusCode;
    private String token;
    private String refreshToken;
    private String role;
    private String username;
    private String message;
    private Integer accountNo;
}
