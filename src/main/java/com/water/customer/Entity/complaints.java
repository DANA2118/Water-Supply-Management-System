package com.water.customer.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Locale;

@Entity
@Table(name = "complaint")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class complaints {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int complaintId;
    private String Subject;
    private String telephoneNo;
    private String Description;
    @Column(name = "Date")
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "AccountNo", referencedColumnName = "AccountNo")
    private customer customer;

}
