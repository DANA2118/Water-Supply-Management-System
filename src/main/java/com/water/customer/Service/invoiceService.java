package com.water.customer.Service;

import com.water.customer.DTO.InvoiceDTO;
import com.water.customer.DTO.InvoicesummaryDTO;
import com.water.customer.Entity.*;
import com.water.customer.Repository.invoiceRepository;
import com.water.customer.Repository.meterreadingRepository;
import com.water.customer.Repository.societyofficerRepository;
import com.water.customer.Repository.userRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.neo4j.Neo4jProperties;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class invoiceService {
    @Autowired
    private invoiceRepository invoiceRepo;

    @Autowired
    private meterreadingRepository meterreadingRepo;

    @Autowired
    private societyofficerRepository officerRepo;

    @Autowired
    private userRepository userRepo;

    public double fetchPreviousBalance(int accountNo) {
        Optional<Invoice> lastInvoice = invoiceRepo.findTopByCustomer_AccountNoAndStatusOrderByInvoiceIdDesc(accountNo, Invoice.Status.UNPAID);
        return lastInvoice.map(Invoice::getBalanceforpay).orElse(0.0);
    }

    @Transactional
    public Invoice generateInvoice(InvoiceDTO invoiceDTO){

        double previousBalance = fetchPreviousBalance(invoiceDTO.getAccountNo());

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        user loggedInUser = userRepo.findByEmail(email);


        societyofficer officer = officerRepo.findByUser(loggedInUser);

        if(officer == null) {
            throw new RuntimeException("Officer not found for the logged-in user.");
        }

        meterreading reading = new meterreading();
        reading.setAccountNo(invoiceDTO.getAccountNo());
        //reading.setReadingId(invoiceDTO.getReadingId());
        reading.setPresentreading(invoiceDTO.getPresentReading());
        reading.setPreviousreading(invoiceDTO.getPreviousReading());
        reading.setOfficer(officer);
        reading.setDate(LocalDate.now());

        meterreadingRepo.save(reading);

        InvoiceDTO calculatedamount = calculateAmount(invoiceDTO, previousBalance);

        Invoice invoice = new Invoice();
        invoice.setAccountNo(invoiceDTO.getAccountNo());
        invoice.setReadingId(reading.getReadingId());
        invoice.setMeterreading(reading);
        invoice.setFixedamount(500);
        invoice.setAdditionalcharge(invoiceDTO.getAdditionalcharge());
        invoice.setSurcharge(0.0);
        invoice.setOthercharges(invoiceDTO.getOthercharges());
        invoice.setTotalamount(calculatedamount.getTotalamount());
        invoice.setBalanceforpay(calculatedamount.getBalanceforpay());
        invoice.setIssuedate(LocalDate.now());
        invoice.setDuedate(LocalDate.now().plusDays(1));
        invoice.setStatus(Invoice.Status.UNPAID);

        return invoiceRepo.save(invoice);
    }


    public InvoiceDTO calculateAmount(InvoiceDTO invoiceDTO, double previousBalance){
        int consumption = invoiceDTO.getPresentReading() - invoiceDTO.getPreviousReading();
        double unitPrice = 10.0;
        double consumptionCharge = consumption * unitPrice;

        double fixedAmount = 500.0;
        double surcharge = 0.0;

        double totalAmount = fixedAmount + consumptionCharge + surcharge + invoiceDTO.getAdditionalcharge() + invoiceDTO.getOthercharges();
        double balanceForPay = totalAmount + previousBalance;

        invoiceDTO.setFixedamount(fixedAmount);
        invoiceDTO.setSurcharge(surcharge);
        invoiceDTO.setTotalamount(totalAmount);
        invoiceDTO.setBalanceforpay(balanceForPay);

        return invoiceDTO;
    }

    public List<InvoicesummaryDTO> getinvoices(){
        return invoiceRepo.getAllInvoiceSummaries();
    }

    public List<Invoice>getcustomerinvoicedetails(int accountNo){
        return invoiceRepo.findAllByAccountNoOrderByIssueDateDesc(accountNo);
    }
}
