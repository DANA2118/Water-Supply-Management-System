package com.water.customer.Service;

import com.water.customer.DTO.AerearsDTO;
import com.water.customer.Repository.invoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArrearsService {
    @Autowired
    private invoiceRepository invoiceRepo;

    public List<AerearsDTO> getAerearsInvoices(){
        return invoiceRepo.findAerearsInvoices();
    }
}
