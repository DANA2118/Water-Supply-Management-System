// src/main/java/com/water/customer/DTO/MonthlyVoucherReportDTO.java
package com.water.customer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyVoucherReportDTO {
    private String period;                     // e.g. "2025-05"
    private double totalCost;                  // sum of all vouchers
    private List<PaymentVoucherSummaryDTO> vouchers;
}
