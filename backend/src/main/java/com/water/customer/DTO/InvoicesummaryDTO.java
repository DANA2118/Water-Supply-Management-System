package com.water.customer.DTO;

import com.water.customer.Entity.Invoice;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvoicesummaryDTO {
    private int invoiceId;
    private String customerName;
    private int accountNo;
    private double balanceforpay;
    private LocalDate duedate;
    private Invoice.Status status;
}
