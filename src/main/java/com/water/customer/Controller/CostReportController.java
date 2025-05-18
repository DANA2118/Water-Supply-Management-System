package com.water.customer.Controller;

import com.water.customer.DTO.MonthlyCostDTO;
import com.water.customer.Service.ReportingService;
import com.water.customer.Service.paymentVoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/costreport")
public class CostReportController {

    @Autowired
    private ReportingService reportingService;

    @GetMapping("/monthlycost")
    public ResponseEntity<?> getMonthlyCost(@RequestParam int year) {
        try {
            List<MonthlyCostDTO> monthlyCost = reportingService.getMonthlyCost(year);
            return ResponseEntity.ok(monthlyCost);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching monthly cost: " + e.getMessage());
        }
    }
}
