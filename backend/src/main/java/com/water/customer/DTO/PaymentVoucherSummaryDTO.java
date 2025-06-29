// src/main/java/com/water/customer/DTO/PaymentVoucherSummaryDTO.java
package com.water.customer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentVoucherSummaryDTO {
    private int voucherId;
    private String payee;
    private LocalDate voucherDate;
    private double totalcost;
    private List<LineItemDTO> items;
}
