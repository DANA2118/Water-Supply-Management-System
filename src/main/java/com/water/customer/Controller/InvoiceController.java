package com.water.customer.Controller;

import com.water.customer.DTO.InvoiceDTO;
import com.water.customer.DTO.InvoicesummaryDTO;
import com.water.customer.Entity.Invoice;
import com.water.customer.Entity.customer;
import com.water.customer.Entity.meterreading;
import com.water.customer.Repository.customerRepository;
import com.water.customer.Repository.meterreadingRepository;
import com.water.customer.Service.InfobipService;
import com.water.customer.Service.TwilioService;
import com.water.customer.Service.invoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/invoice")
public class InvoiceController {

    @Autowired
    private invoiceService invoiceservice;

    @Autowired
    private TwilioService twilioService;

    @Autowired
    private InfobipService infobipService;

    @Autowired
    private customerRepository customerRepo;

    @Autowired
    private meterreadingRepository meterreadingRepo;

    @PostMapping("/generate")
    public ResponseEntity<?> generateInvoice(@RequestBody InvoiceDTO invoiceDTO) {
        try {

            Invoice invoice = invoiceservice.generateInvoice(invoiceDTO);

            Optional<customer> custOpt = customerRepo.findById(invoice.getAccountNo());
            if (custOpt.isPresent()) {
                String phone = custOpt.get().getTelephoneNo();
                String message = "Your invoice has been generated. Total Amount: "
                        + invoice.getTotalamount() + ". Due Date: " + invoice.getDuedate();
                try {
                    infobipService.sendSms(phone, message);
                } catch (Exception smsEx) {
                    System.err.println("Failed to send SMS: " + smsEx.getMessage());
                }
            }

            return ResponseEntity.ok(invoice);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error generating invoice: " + e.getMessage());
        }
    }

    @GetMapping("/getcustomer/{accountNo}")
    public ResponseEntity<?> getCustomerDetails(@PathVariable int accountNo) {
        Optional<customer> custOpt = customerRepo.findById(accountNo);
        if (custOpt.isPresent()) {
            customer cust = custOpt.get();
            Optional<meterreading> lastReading = meterreadingRepo.findTopByCustomerAccountNoOrderByDateDesc(accountNo);
            int previousReading = lastReading.map(mr -> mr.getPresentreading()).orElse(0);
            Map<String, Object> result = new HashMap<>();
            result.put("name", cust.getName());
            result.put("previousReading", previousReading);
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
    }

    @PostMapping("/calculate")
    public ResponseEntity<?> calculateInvoice(@RequestBody InvoiceDTO invoiceDTO) {
        try {
            double previousBalance = invoiceservice.fetchPreviousBalance(invoiceDTO.getAccountNo());
            InvoiceDTO calculatedAmount = invoiceservice.calculateAmount(invoiceDTO, previousBalance);
            return ResponseEntity.ok(calculatedAmount);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error calculating invoice: " + e.getMessage());
        }
    }

    @GetMapping("/get/{accountNo}")
    public ResponseEntity<?> getInvoice(@PathVariable int accountNo){
        List<Invoice> invoices = invoiceservice.getcustomerinvoicedetails(accountNo);
        if (invoices.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No invoices found for this account number");
        }
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/getall")
    public ResponseEntity<?> getAllInvoices(){
        List<InvoicesummaryDTO> allinvoices = invoiceservice.getinvoices();
        return ResponseEntity.ok(allinvoices);
    }

}
