package com.water.customer.Service;


import com.water.customer.DTO.*;
import com.water.customer.Entity.paymentVoucher;
import com.water.customer.Entity.paymentvoucherdes;
import com.water.customer.Entity.societyofficer;
import com.water.customer.Entity.user;
import com.water.customer.Repository.paymentVoucherRepository;
import com.water.customer.Repository.paymentvoucherdesRepository;
import com.water.customer.Repository.societyofficerRepository;
import com.water.customer.Repository.userRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class paymentVoucherService {
    @Autowired
    private paymentVoucherRepository voucherrepo;

    @Autowired
    private paymentvoucherdesRepository voucherdesrepo;

    @Autowired
    private societyofficerRepository officerrepo;

    @Autowired
    private userRepository userrepo;

    @Transactional
    public paymentVoucher saveVoucher(voucherDTO voucher) {
        paymentVoucher savedVoucher = new paymentVoucher();
        savedVoucher.setPayee(voucher.getPayee());
        savedVoucher.setVoucherDate(voucher.getVoucher_date());

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        user loggedInUser = userrepo.findByEmail(email);


        societyofficer officer = officerrepo.findByUser(loggedInUser);

        if(officer == null) {
            throw new RuntimeException("Officer not found for the logged-in user.");
        }

        savedVoucher.setOfficer(officer);

        double total =0.0;
        for (voucherdesDTO des : voucher.getDes()){
            paymentvoucherdes voucherDes = new paymentvoucherdes();
            voucherDes.setDescription(des.getDescription());
            voucherDes.setCost(des.getCost());
            voucherDes.setVoucher(savedVoucher);
            savedVoucher.getDes().add(voucherDes);
            total = total + des.getCost();
        }
        savedVoucher.setTotalcost(total);
        return voucherrepo.save(savedVoucher);
    }

    public List<paymentVoucher> getAllVouchers() {
        return voucherrepo.findAll();
    }

    public MonthlyVoucherReportDTO monthlyReport(int month, int year) {
        // 1) fetch all vouchers this period
        List<paymentVoucher> vouchers = voucherrepo.findAllByMonthYear(month, year);

        // 2) map to summary DTOs
        List<PaymentVoucherSummaryDTO> list = vouchers.stream().map(v -> {
            List<LineItemDTO> items = v.getDes().stream()
                    .map(d -> new LineItemDTO(d.getId(), d.getDescription(), d.getCost()))
                    .toList();

            return new PaymentVoucherSummaryDTO(
                    v.getVoucherId(),
                    v.getPayee(),
                    v.getVoucherDate(),
                    v.getTotalcost(),
                    items
            );
        }).toList();

        // 3) total cost (reuse existing)
        double total = voucherrepo.findMonthlyTotal(month, year);

        // 4) period string
        String period = String.format("%04d-%02d", year, month);

        return new MonthlyVoucherReportDTO(period, total, list);
    }

    public MonthlyVoucherReportDTO yearlyReport(int year) {
        // year‐wide
        // you could add a findAllByYear query similar to above, or just reuse findAll()
        List<paymentVoucher> vouchers = voucherrepo.findAll().stream()
                .filter(v -> v.getVoucherDate().getYear() == year)
                .toList();

        List<PaymentVoucherSummaryDTO> list = vouchers.stream().map(v -> {
            List<LineItemDTO> items = v.getDes().stream()
                    .map(d -> new LineItemDTO(d.getId(), d.getDescription(), d.getCost()))
                    .toList();

            return new PaymentVoucherSummaryDTO(
                    v.getVoucherId(),
                    v.getPayee(),
                    v.getVoucherDate(),
                    v.getTotalcost(),
                    items
            );
        }).toList();

        double total = voucherrepo.findYearlyTotal(year);
        String period = String.valueOf(year);

        return new MonthlyVoucherReportDTO(period, total, list);
    }


    public voucherAggregateDTO monthlycost(int month, int year)
    {
        double monthlyTotal = voucherrepo.findMonthlyTotal(month, year);
        String period = String.format("%04d-%02d", month, year);
        return new voucherAggregateDTO(period, monthlyTotal);

    }

    public voucherAggregateDTO yearlycost(int year)
    {
        double yearlyTotal = voucherrepo.findYearlyTotal(year);
        String period = String.valueOf(year);
        return new voucherAggregateDTO(period, yearlyTotal);
    }

    @Transactional
    public MonthlyVoucherReportDTO monthlyReportByDescription(
            int month, int year, String description) {

        List<paymentvoucherdes> lineItems =
                voucherdesrepo.findByDescriptionAndMonthYear(description, year, month);

        Map<Integer, List<paymentvoucherdes>> itemsByVoucherId = lineItems.stream().collect(Collectors.groupingBy(d -> d.getVoucher().getVoucherId()));

        List<PaymentVoucherSummaryDTO> summaries = itemsByVoucherId.entrySet().stream()
                .map(entry -> {
                    int vid = entry.getKey();
                    List<paymentvoucherdes> items = entry.getValue();
                    paymentVoucher v = items.get(0).getVoucher();

                    List<LineItemDTO> dtoItems = items.stream()
                            .map(d -> new LineItemDTO(d.getId(), d.getDescription(), d.getCost()))
                            .toList();

                    return new PaymentVoucherSummaryDTO(
                            v.getVoucherId(),
                            v.getPayee(),
                            v.getVoucherDate(),
                            v.getTotalcost(),
                            dtoItems
                    );
                })
                .toList();

        double total = lineItems.stream().mapToDouble(d -> d.getCost()).sum();

        String period = String.format("%04d-%02d", year, month);
        return new MonthlyVoucherReportDTO(period, total, summaries);
    }

    @Transactional
    public MonthlyVoucherReportDTO yearlyReportByDescription(
            int year, String description) {

        List<paymentvoucherdes> lineItems =
                voucherdesrepo.findByDescriptionAndYear(description, year);

        Map<Integer, List<paymentvoucherdes>> itemsByVoucherId =
                lineItems.stream()
                        .collect(Collectors.groupingBy(d -> d.getVoucher().getVoucherId()));

        List<PaymentVoucherSummaryDTO> summaries = itemsByVoucherId.entrySet().stream()
                .map(entry -> {
                    List<paymentvoucherdes> items = entry.getValue();
                    paymentVoucher v = items.get(0).getVoucher();
                    List<LineItemDTO> dtoItems = items.stream()
                            .map(d -> new LineItemDTO(d.getId(), d.getDescription(), d.getCost()))
                            .toList();

                    return new PaymentVoucherSummaryDTO(
                            v.getVoucherId(),
                            v.getPayee(),
                            v.getVoucherDate(),
                            v.getTotalcost(),
                            dtoItems
                    );
                })
                .toList();

        double total = lineItems.stream().mapToDouble(d -> d.getCost()).sum();
        String period = String.valueOf(year);
        return new MonthlyVoucherReportDTO(period, total, summaries);
    }


}
