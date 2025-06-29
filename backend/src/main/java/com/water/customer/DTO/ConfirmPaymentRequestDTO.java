package com.water.customer.DTO;

import lombok.Data;

@Data
public class ConfirmPaymentRequestDTO {
    private String paymentIntentId;
}
