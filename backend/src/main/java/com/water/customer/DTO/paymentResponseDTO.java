// src/main/java/com/water/customer/DTO/PaymentResponseDTO.java

package com.water.customer.DTO;

import com.water.customer.Entity.payment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class paymentResponseDTO {
    private int paymentId;
    private int invoiceId;
    private int accountNo;
    private LocalDate paymentDate;
    private double paymentAmount;
    private String paymentMethod;
    private String status;


    /** Factory to build a DTO from the entity **/
    public static paymentResponseDTO from(payment p) {
        return paymentResponseDTO.builder()
                .paymentId(p.getPaymentId())
                .invoiceId(p.getInvoice().getInvoiceId())
                .accountNo(p.getCustomer().getAccountNo())
                .paymentDate(p.getPaymentDate())
                .paymentAmount(p.getPaymentAmount())
                .paymentMethod(p.getMethod().name())
                .status("COMPLETED")
                .build();
    }
}
