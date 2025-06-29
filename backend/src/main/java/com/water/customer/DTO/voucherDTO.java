package com.water.customer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class voucherDTO {
    private String payee;
    private LocalDate voucher_date;
    private List<voucherdesDTO> des = new ArrayList<>();
}
