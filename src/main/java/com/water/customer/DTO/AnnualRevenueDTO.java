package com.water.customer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnnualRevenueDTO {
    private int year;
    private double totalrevenue;
}
