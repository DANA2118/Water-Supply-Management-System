package com.water.customer.DTO;

import com.water.customer.Entity.Invoice;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsagehistoryDTO {
    private int invoiceId;
    private int consumption;
    private String period;
    private double amount;
    private double balanceforpay;
    private Invoice.Status status;
    private LocalDate duedate;

}
