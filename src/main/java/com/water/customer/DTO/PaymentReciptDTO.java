package com.water.customer.DTO;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class PaymentReciptDTO {
    private String transactionId;      // e.g. "TRN12345" or UUID
    private String customerName;
    private int accountNo;
    private int invoiceId;
    private double totalAmount;        // original invoice total
    private double amountPaid;
    private double balanceRemaining;   // after this payment
    private LocalDate paymentDate;
}
