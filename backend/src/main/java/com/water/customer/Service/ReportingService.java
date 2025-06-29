package com.water.customer.Service;

import com.water.customer.DTO.*;
import com.water.customer.Entity.Invoice;
import com.water.customer.Repository.invoiceRepository;
import com.water.customer.Repository.paymentRepository;
import com.water.customer.Repository.paymentVoucherRepository;
import com.water.customer.Repository.paymentvoucherdesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReportingService {

    @Autowired
    private paymentRepository paymentRepo;

    @Autowired
    private paymentVoucherRepository paymentVoucherRepo;

    @Autowired
    private paymentvoucherdesRepository desRepo;

    @Autowired
    private invoiceRepository invoiceRepo;

    public AnnualRevenueDTO getAnnualRevenue(int year) {
        double totalRevenue = paymentRepo.findTotalRevenueForYear(year);
        return new AnnualRevenueDTO(year, totalRevenue);
    }

    public List<MonthlyRevenueDTO> getMonthlyRevenue(int year) {
        List<MonthlyRevenueDTO> result = new ArrayList<>();

        for (int m = 1; m <= 12; m++) {
            result.add(new MonthlyRevenueDTO(m, 0.0));
        }

        List<Object[]> rows = paymentRepo.findMonthlyRevenue(year);
        for (Object[] row : rows) {
            int month    = ((Number) row[0]).intValue();
            double rev   = ((Number) row[1]).doubleValue();
            result.set(month-1, new MonthlyRevenueDTO(month, rev));
        }
        return result;
    }

    public ProfitLossDTO getProfitLossDetail(int year) {
        double revenue = paymentRepo.findTotalRevenueForYear(year);
        double cost    = paymentVoucherRepo.findTotalCostForYear(year);

        List<Object[]> rows = desRepo.findCostBreakdownByYear(year);
        List<LineItemDTO> breakdown = rows.stream()
                .map(r -> new LineItemDTO(
                        ((Number)r[0]).intValue(),
                        (String)r[1],
                        ((Number)r[2]).doubleValue()
                ))
                .toList();

        double profit = revenue - cost;
        return new ProfitLossDTO(year, revenue, cost, profit, breakdown);
    }

    public List<MonthlyCostDTO> getMonthlyCost(int year) {
        List<MonthlyCostDTO> result = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            result.add(new MonthlyCostDTO(m, 0.0));
        }

        List<Object[]> rows = paymentVoucherRepo.findMonthlyCost(year);
        for (Object[] row : rows) {
            int month    = ((Number) row[0]).intValue();
            double cost   = ((Number) row[1]).doubleValue();
            result.set(month-1, new MonthlyCostDTO(month, cost));
        }
        return result;
    }
    public List<ConsumptionPatternDTO> getConsumptionPattern(int accountNo){
        LocalDate today = LocalDate.now();
        YearMonth thisym = YearMonth.from(today);
        YearMonth startym = thisym.minusMonths(11);

        LocalDate startDate = startym.atDay(1);
        LocalDate endDate = thisym.atEndOfMonth();

        List<Invoice> invoices = invoiceRepo.findByAccountNoAndIssuedateBetweenOrderByIssuedateAsc(accountNo, startDate, endDate);

        var map = new java.util.HashMap<YearMonth,Integer>();
        for (Invoice invoice : invoices) {
            if (invoice.getMeterreading()==null) {
                continue;
            }
            YearMonth ym = YearMonth.from(invoice.getIssuedate());
            int consumption = invoice.getMeterreading().getPresentreading() - invoice.getMeterreading().getPreviousreading();
            map.put(ym, consumption);
        }

        List<ConsumptionPatternDTO> result = new ArrayList<>();
        YearMonth ym = startym;
        for (int i = 0; i < 12; i++) {
            int m = ym.getMonthValue();
            int y = ym.getYear();
            int consumption = map.getOrDefault(ym, 0);
            result.add(new ConsumptionPatternDTO(m, consumption, y));
            ym = ym.plusMonths(1);
        }

        return result;
    }
}
