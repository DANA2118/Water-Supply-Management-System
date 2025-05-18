package com.water.customer.Controller;

import ch.qos.logback.core.net.SyslogOutputStream;
import com.water.customer.DTO.*;
import com.water.customer.Entity.Invoice;
import com.water.customer.Entity.customer;
import com.water.customer.Entity.meterreading;
import com.water.customer.Repository.customerRepository;
import com.water.customer.Repository.meterreadingRepository;
import com.water.customer.Service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLOutput;
import java.time.LocalDate;
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
    private TariffService tariffService;

    @Autowired
    private TwilioService twilioService;

    @Autowired
    private InfobipService infobipService;

    @Autowired
    private NotifyService notifyService;

    @Autowired
    private customerRepository customerRepo;

    @Autowired
    private meterreadingRepository meterreadingRepo;

    @Autowired
    private ReportingService reportingService;


    private String normalizeToE164(String localNumber) {
        String digits = localNumber.replaceAll("\\D+", "");
        if (digits.startsWith("0")) {
            digits = "94" + digits.substring(1);
        }
        return digits;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateInvoice(@RequestBody InvoiceDTO invoiceDTO) {
        try {

            Invoice invoice = invoiceservice.generateInvoice(invoiceDTO);

            Optional<customer> custOpt = customerRepo.findById(invoice.getAccountNo());

            if (custOpt.isPresent()) {
                String to = normalizeToE164(custOpt.get().getTelephoneNo());
                String message = "Your water bill invoice has been generated. Total Amount: "
                        + invoice.getTotalamount() +". Balance for Pay: "+ invoice.getBalanceforpay()+ ". Due Date: " + invoice.getDuedate();
                notifyService.sendSms(to, message)
                        .doOnError(err -> System.err.println("Failed to send SMS: " + err.getMessage()))
                        .subscribe();
                System.out.println("SMS sent successfully");
            }

            return ResponseEntity.ok(invoice);
        }catch (IllegalArgumentException | IllegalStateException ex) {
            ex.printStackTrace();              // <-- dump full stack
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", ex.getMessage()));
        }


        catch (Exception e) {
            return ResponseEntity.status(500).body("Error generating invoice: " + e.getMessage());
        }
    }

    @GetMapping("/getcustomer/{accountNo}")
    public ResponseEntity<?> getCustomerDetails(@PathVariable int accountNo) {
        Optional<customer> custOpt = customerRepo.findById(accountNo);
        if (custOpt.isPresent()) {
            customer cust = custOpt.get();
            TariffResponseDTO tariff = tariffService.getCurrentTariff(cust.getUsertype(), LocalDate.now());

            Optional<meterreading> lastReading = meterreadingRepo.findTopByCustomerAccountNoOrderByDateDesc(accountNo);
            int previousReading = lastReading.map(mr -> mr.getPresentreading()).orElse(0);

            Map<String, Object> result = new HashMap<>();
            result.put("name", cust.getName());
            result.put("previousReading", previousReading);
            result.put("FixedCharge", tariff.getFixedCharge());
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
    }

    @PostMapping("/calculate")
    public ResponseEntity<?> calculateInvoice(@RequestBody InvoiceDTO invoiceDTO) {
        try {
            double previousBalance = invoiceservice.fetchPreviousBalance(invoiceDTO.getAccountNo());
            InvoiceDTO calculatedAmount = invoiceservice.calculateAmount(invoiceDTO, previousBalance, LocalDate.now());
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

    @GetMapping("/getlatestinvoice/{accountNo}")
    public ResponseEntity<LatestInvoiceDTO> getLatestInvoice(
            @PathVariable int accountNo
    ) {
        LatestInvoiceDTO dto = invoiceservice.getLatestUnpaidInvoice(accountNo);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/consumptionpattern")
    public List<ConsumptionPatternDTO> getConsumptionPattern( @RequestParam int accountNo) {
        return reportingService.getConsumptionPattern(accountNo);
    }

}
