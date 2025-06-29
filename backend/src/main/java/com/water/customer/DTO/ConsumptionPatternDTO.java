package com.water.customer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ConsumptionPatternDTO {
    private int month;
    private double consumption;
    private int year;
}
