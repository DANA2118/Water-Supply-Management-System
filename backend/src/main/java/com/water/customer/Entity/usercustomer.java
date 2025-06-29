package com.water.customer.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table (name = "usercustomer")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class usercustomer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="AccountNo")
    private Integer accountNo;

    @Column(name="username", nullable = false)
    private String username;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private user user;

    @OneToOne
    @JoinColumn(name = "AccountNo", referencedColumnName = "AccountNo", insertable = false, updatable = false)
    private customer customer;

}
