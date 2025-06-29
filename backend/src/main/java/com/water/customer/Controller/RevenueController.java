package com.water.customer.Controller;


import com.water.customer.DTO.AnnualRevenueDTO;
import com.water.customer.DTO.MonthlyRevenueDTO;
import com.water.customer.DTO.ProfitLossDTO;
import com.water.customer.Service.ReportingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/revenue")
public class RevenueController {

    @Autowired
    private ReportingService reportingService;

    @GetMapping("/annualrevenue")
    public ResponseEntity<?> getAnnualRevenue(@RequestParam int year) {
        try {
            AnnualRevenueDTO annualRevenue = reportingService.getAnnualRevenue(year);
            return ResponseEntity.ok(annualRevenue);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching annual revenue: " + e.getMessage());
        }
    }

    @GetMapping("/monthlyrevenue")
    public ResponseEntity<?> getMonthlyRevenue(@RequestParam int year) {
        try {
            List<MonthlyRevenueDTO> monthlyRevenue = reportingService.getMonthlyRevenue(year);
            return ResponseEntity.ok(monthlyRevenue);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching monthly revenue: " + e.getMessage());
        }
    }

    @GetMapping("/profitloss")
    public ResponseEntity<?> getProfitLossDetail(@RequestParam int year) {
        try {
            ProfitLossDTO profitLoss = reportingService.getProfitLossDetail(year);
            return ResponseEntity.ok(profitLoss);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching profit/loss details: " + e.getMessage());
        }
    }
}
