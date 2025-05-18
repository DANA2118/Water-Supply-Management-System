package com.water.customer.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "tariff")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Tariff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "fixed_charge")
    private double fixedCharge;

    @Column(name = "rate_per_unit")
    private double ratePerUnit;

    @Column(name = "effective_date")
    private LocalDate effectiveDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false)
    private customer.Usertype usertype;

    @Column(name = "created_at")
    private LocalDateTime createdAt;


}
