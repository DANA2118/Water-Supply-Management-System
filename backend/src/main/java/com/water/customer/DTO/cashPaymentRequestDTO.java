package com.water.customer.DTO;


import lombok.Data;

@Data
public class cashPaymentRequestDTO {
    private int accountNo;
    private double paymentAmount;
    private int invoiceId;
}
