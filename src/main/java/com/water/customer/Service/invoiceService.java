package com.water.customer.Service;

import com.water.customer.DTO.*;
import com.water.customer.Entity.*;
import com.water.customer.Repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.neo4j.Neo4jProperties;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    @Autowired
    private customerRepository customerRepo;

    @Autowired
    private TariffService tariffService;

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

    public double fetchPreviousBalance(int accountNo) {
        Optional<Invoice> lastInvoice = invoiceRepo.findTopByCustomer_AccountNoAndStatusOrderByInvoiceIdDesc(accountNo, Invoice.Status.UNPAID);
        return lastInvoice.map(Invoice::getBalanceforpay).orElse(0.0);
    }

    @Transactional
    public Invoice generateInvoice(InvoiceDTO invoiceDTO){

        LocalDate now = LocalDate.now();
        LocalDate startDate = now.withDayOfMonth(1);
        LocalDate endDate = now.withDayOfMonth(now.lengthOfMonth());

        if (meterreadingRepo.existsByAccountNoAndDateBetween(invoiceDTO.getAccountNo(), startDate, endDate)) {
            throw new IllegalStateException("A meter reading for account " + invoiceDTO.getAccountNo() + "has already been recorded for " + now.getMonth() + " " + now.getYear());
        }

        if (invoiceRepo.existsByAccountNoAndIssuedateBetween(invoiceDTO.getAccountNo(), startDate, endDate)) {
            throw new IllegalStateException("An invoice for account " + invoiceDTO.getAccountNo() + " has already been generated for " + now.getMonth() + " " + now.getYear());
        }

        double previousBalance = fetchPreviousBalance(invoiceDTO.getAccountNo());

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        user loggedInUser = userRepo.findByEmail(email);


        societyofficer officer = officerRepo.findByUser(loggedInUser);

        if(officer == null) {
            throw new RuntimeException("Officer not found for the logged-in user.");
        }

        meterreading reading = new meterreading();
        reading.setAccountNo(invoiceDTO.getAccountNo());
        reading.setPresentreading(invoiceDTO.getPresentReading());
        reading.setPreviousreading(invoiceDTO.getPreviousReading());
        reading.setOfficer(officer);
        reading.setDate(LocalDate.now());

        meterreadingRepo.save(reading);

        InvoiceDTO calculatedamount = calculateAmount(invoiceDTO, previousBalance, LocalDate.now());

        Invoice invoice = new Invoice();
        invoice.setAccountNo(invoiceDTO.getAccountNo());
        invoice.setReadingId(reading.getReadingId());
        invoice.setMeterreading(reading);
        invoice.setFixedamount(calculatedamount.getFixedamount());
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


    public InvoiceDTO calculateAmount(InvoiceDTO invoiceDTO, double previousBalance, LocalDate asOfDate) {

        if (invoiceDTO.getPresentReading() <= invoiceDTO.getPreviousReading()) {
            throw new IllegalArgumentException("Present reading must be greater than previous reading.");
        }else {

            customer c = customerRepo.findByAccountNo(invoiceDTO.getAccountNo());
            if (c == null) {
                throw new IllegalArgumentException("Customer not found for account number: " + invoiceDTO.getAccountNo());
            }
            TariffResponseDTO tariff = tariffService.getCurrentTariff(c.getUsertype(), asOfDate);
            if (tariff == null) {
                throw new IllegalArgumentException("Tariff not found for user type: " + c.getUsertype());
            }

            int consumption = invoiceDTO.getPresentReading() - invoiceDTO.getPreviousReading();
            double unitPrice = tariff.getRatePerUnit();
            double consumptionCharge = consumption * unitPrice;

            double fixedAmount = tariff.getFixedCharge();
            double surcharge = 0.0;

            double totalAmount = fixedAmount + consumptionCharge + surcharge + invoiceDTO.getAdditionalcharge() + invoiceDTO.getOthercharges();
            double balanceForPay = totalAmount + previousBalance;

            invoiceDTO.setFixedamount(fixedAmount);
            invoiceDTO.setSurcharge(surcharge);
            invoiceDTO.setTotalamount(totalAmount);
            invoiceDTO.setBalanceforpay(balanceForPay);

            return invoiceDTO;
        }
    }

    public List<UsagehistoryDTO>getusagehistory(int accountNo){
        List<Invoice> invoice = invoiceRepo.findByAccountNoOrderByIssuedateDesc(accountNo);

        return invoice.stream().map(inv -> {
            int consumption = inv.getMeterreading().getPresentreading() - inv.getMeterreading().getPreviousreading();
            String period = inv.getIssuedate().format(formatter);

            return new UsagehistoryDTO(
                    inv.getInvoiceId(),
                    consumption,
                    period,
                    inv.getTotalamount(),
                    inv.getBalanceforpay(),
                    inv.getStatus(),
                    inv.getDuedate()
            );
        }).collect(Collectors.toList());
    }

    public UsagehistoryDTO getlatestinvoice(int accountNo){
        List<Invoice> invoice = invoiceRepo.findByAccountNoOrderByIssuedateDesc(accountNo);

        if (invoice.isEmpty()) {
            return null; // or throw an exception if you prefer
        }

        Invoice latestInvoice = invoice.get(0);
        int consumption = latestInvoice.getMeterreading().getPresentreading() - latestInvoice.getMeterreading().getPreviousreading();
        String period = latestInvoice.getIssuedate().format(formatter);

        return new UsagehistoryDTO(
                latestInvoice.getInvoiceId(),
                consumption,
                period,
                latestInvoice.getTotalamount(),
                latestInvoice.getBalanceforpay(),
                latestInvoice.getStatus(),
                latestInvoice.getDuedate()
        );
    }

    public List<InvoicesummaryDTO> getinvoices(){
        return invoiceRepo.getAllInvoiceSummaries();
    }

    public List<Invoice>getcustomerinvoicedetails(int accountNo){
        return invoiceRepo.findAllByAccountNoOrderByIssueDateDesc(accountNo);
    }

    public LatestInvoiceDTO getLatestUnpaidInvoice(int accountNo) {
        Invoice inv = invoiceRepo
                .findFirstByAccountNoAndStatusOrderByIssuedateDesc(accountNo, Invoice.Status.UNPAID)
                .orElseThrow(() -> new IllegalArgumentException("No unpaid invoice for account " + accountNo));

        return new LatestInvoiceDTO(
                inv.getInvoiceId(),
                inv.getTotalamount(),
                inv.getBalanceforpay(),
                inv.getCustomer().getName()
        );
    }
}
