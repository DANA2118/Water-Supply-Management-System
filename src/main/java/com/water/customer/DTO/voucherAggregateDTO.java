package com.water.customer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class voucherAggregateDTO {
    private String period;
    private double totalcost;
}
