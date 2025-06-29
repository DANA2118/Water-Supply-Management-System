package com.water.customer.DTO;

import com.water.customer.Entity.customer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.usertype.UserType;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TariffResponseDTO {
    private int id;
    private double fixedCharge;
    private double ratePerUnit;
    private String effectiveDate;
    private customer.Usertype usertype;
}
