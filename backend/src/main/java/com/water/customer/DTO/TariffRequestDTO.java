package com.water.customer.DTO;

import com.water.customer.Entity.customer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.usertype.UserType;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TariffRequestDTO {
    private LocalDate effectiveDate;
    private double ratePerUnit;
    private customer.Usertype usertype;
    private double fixedCharge;

}
