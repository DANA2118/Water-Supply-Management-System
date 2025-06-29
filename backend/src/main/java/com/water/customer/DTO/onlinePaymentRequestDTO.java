package com.water.customer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class onlinePaymentRequestDTO {
    private long amount;
    private String currency;   // e.g. "lkr"
    private int invoiceId;
}
