package com.water.customer.Controller;


import com.water.customer.DTO.AerearsDTO;
import com.water.customer.Service.ArrearsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/arrears")
public class Arrearscontroller {

    @Autowired
    private  ArrearsService arrearsService;

    @GetMapping("/overdue")
    public List<AerearsDTO> getAerearsInvoices() {
        return arrearsService.getAerearsInvoices();
    }
}
