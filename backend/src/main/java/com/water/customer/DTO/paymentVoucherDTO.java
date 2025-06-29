package com.water.customer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class paymentVoucherDTO {
    private int voucher_Id;
    private LocalDate voucher_date;
    private String payee;
    private String description;
    private double costamount;
    private int Officer_id;
}
