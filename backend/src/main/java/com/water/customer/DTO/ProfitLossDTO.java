package com.water.customer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ProfitLossDTO {
    private int year;
    private double totalRevenue;
    private double totalCost;
    private double profitLoss;
    private List<LineItemDTO> costBreakdown;
}
