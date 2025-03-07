package com.water.customer.DTO;

import lombok.*;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class customerDTO {
    private int accountNo;
    private String name;
    private String telephoneNo;
    private String email;
    private String address;
    private int meterNo;
    private Date created_at;
    private Date Updated_at;
    private String status;
    private String usertype;
}



