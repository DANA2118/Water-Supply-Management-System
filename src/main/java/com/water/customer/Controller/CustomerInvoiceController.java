package com.water.customer.Controller;

import com.water.customer.DTO.UsagehistoryDTO;
import com.water.customer.Entity.Invoice;
import com.water.customer.Service.AuthUtil;
import com.water.customer.Service.invoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customer")
public class CustomerInvoiceController {

    @Autowired
    private invoiceService service;

    @GetMapping("/invoices")
    public ResponseEntity<?> myInvoices() {
        Integer accountNo = AuthUtil.getCurrentAccountNo();
        if (accountNo == null) {
            return ResponseEntity.status(403).body("Not a valid customer");
        }
        List<UsagehistoryDTO> history = service.getusagehistory(accountNo);
        return ResponseEntity.ok(history);

    }

    @GetMapping("/latestinvoice")
    public ResponseEntity<?> latestInvoice() {
        Integer accountNo = AuthUtil.getCurrentAccountNo();
        if (accountNo == null) {
            return ResponseEntity.status(403).body("Not a valid customer");
        }
        UsagehistoryDTO invoice = service.getlatestinvoice(accountNo);
        if(invoice == null) {
            return ResponseEntity.status(404).body("No invoice found");
        } else {
            return ResponseEntity.ok(invoice);
        }
    }

}
