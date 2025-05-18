// src/main/java/com/water/customer/DTO/LineItemDTO.java
package com.water.customer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LineItemDTO {
    private int id;
    private String description;
    private double cost;
}
