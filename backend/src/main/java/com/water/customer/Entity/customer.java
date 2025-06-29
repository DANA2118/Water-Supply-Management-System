package com.water.customer.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Entity
@Data
@Table (name = "customer")
@NoArgsConstructor
@AllArgsConstructor
public class customer {
    @Id
    @Column(name = "AccountNo")
    private int accountNo;
    private String name;
    @Column(name = "TelephoneNo")
    private String telephoneNo;
    private String email;
    private String address;
    @Column(name = "MeterNo")
    private int meterNo;


    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date created_at;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date Updated_at;

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status {
        Active,
        Inactive
    }

    @Enumerated(EnumType.STRING)
    private Usertype usertype;

    public enum Usertype {
        Residential,
        Commercial
    }




}
