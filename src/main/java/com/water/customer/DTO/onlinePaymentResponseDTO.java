package com.water.customer.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class onlinePaymentResponseDTO {
    private String clientSecret;
    private String paymentIntentId;
}
