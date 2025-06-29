package com.water.customer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class LatestInvoiceDTO {
    private int invoiceId;
    private double totalAmount;
    private double balanceForPay;
    private String customerName;
}
