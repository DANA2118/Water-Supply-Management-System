package com.water.customer.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "meterreadings")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class meterreading {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Reading_id")
    private int readingId;

    @Column(name = "AccountNo")
    private int accountNo;

    @ManyToOne
    @JoinColumn(name = "Officer_id", referencedColumnName = "Officer_id", nullable = false)
    private societyofficer officer;

    @Column(name = "Present_reading")
    private int presentreading;

    @Column(name = "Previous_reading")
    private int previousreading;

    @Column(name = "Date")
    private LocalDate date;

    @OneToOne
    @JoinColumn(name = "AccountNo", referencedColumnName = "AccountNo", insertable = false, updatable = false)
    private customer customer;

}
