package com.water.customer.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "invoice")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Invoice_Id")
    private int invoiceId;

    @Column(name = "AccountNo")
    private int accountNo;

    @Column(name = "Reading_id")
    private int readingId;

    @OneToOne
    @JoinColumn(name = "AccountNo", referencedColumnName = "AccountNo", insertable = false, updatable = false)
    private customer customer;

    @OneToOne
    @JoinColumn(name = "Reading_id", referencedColumnName = "Reading_id", insertable = false, updatable = false)
    private meterreading meterreading;

    @Column(name = "Fixed_amount")
    private double fixedamount;

    @Column(name = "Additional_charges")
    private double additionalcharge;

    @Column(name = "surcharge")
    private double surcharge;

    @Column(name = "Other_charges")
    private double othercharges;

    @Column(name = "Total_amount")
    private double totalamount;

    @Column(name = "Balance_for_pay")
    private double balanceforpay;

    @Column(name = "Issue_date")
    private LocalDate issuedate;

    @Column(name = "Due_date")
    private LocalDate duedate;

    @Enumerated(EnumType.STRING)
    private com.water.customer.Entity.Invoice.Status status;

    public enum Status {
        PAID,
        UNPAID
    }


}
