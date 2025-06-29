// src/main/java/com/water/customer/Entity/Payment.java
package com.water.customer.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Payment_id")
    private int paymentId;

    @Column(name = "Payment_date", nullable = false)
    private LocalDate paymentDate;

    @Column(name = "Payment_amount", nullable = false)
    private double paymentAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "Payment_method", nullable = false)
    private PaymentMethod method;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AccountNo", referencedColumnName = "AccountNo", nullable = false)
    private customer customer;

    public enum PaymentMethod {
        ONLINE,
        CASH
    }
}
