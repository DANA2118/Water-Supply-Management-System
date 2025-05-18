package com.water.customer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintDTO {
    private int complaintId;
    private String subject;
    private String telephoneNo;
    private String description;
    private LocalDate Date;
    private Integer accountNo;
}
