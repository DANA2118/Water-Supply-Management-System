package com.water.customer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AerearsDTO {
    private int accountNo;
    private String name;
    private String telephoneNo;
    private String address;
    private double balanceforpay;
    private LocalDate duedate;
}
