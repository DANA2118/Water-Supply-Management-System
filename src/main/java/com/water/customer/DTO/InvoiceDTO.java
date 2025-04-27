package com.water.customer.DTO;

import com.water.customer.Entity.customer;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceDTO {
    private int invoiceId;
    private int readingId;
    private Integer accountNo;
    private double fixedamount;
    private double additionalcharge;
    private double surcharge;
    private double othercharges;
    private double totalamount;
    private double balanceforpay;
    private int presentReading;
    private int previousReading;
    private LocalDate issuedate;
    private LocalDate duedate;
    private int officerId;
}
