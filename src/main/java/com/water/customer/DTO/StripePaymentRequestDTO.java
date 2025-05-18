package com.water.customer.DTO;

import lombok.Data;

@Data
public class StripePaymentRequestDTO {
    private long amount;
    private String currency;
    private int invoiceId;

}
