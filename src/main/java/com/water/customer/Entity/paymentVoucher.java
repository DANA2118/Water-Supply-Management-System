package com.water.customer.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table (name = "payment_voucher")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class paymentVoucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "voucher_id")
    private int voucherId;

    @Column(name = "payee")
    private String payee;

    @Column(name = "voucher_date")
    private LocalDate voucherDate;


    @Column(name = "totalcost")
    private double totalcost;


    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "Officer_id", referencedColumnName = "Officer_id", nullable = false)
    @JsonIgnore
    private societyofficer officer;


    @OneToMany(mappedBy = "voucher", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<paymentvoucherdes> des = new ArrayList<>();


}
