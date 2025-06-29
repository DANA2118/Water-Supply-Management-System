package com.water.customer.Controller;


import com.water.customer.DTO.MonthlyVoucherReportDTO;
import com.water.customer.DTO.paymentVoucherDTO;
import com.water.customer.DTO.voucherAggregateDTO;
import com.water.customer.DTO.voucherDTO;
import com.water.customer.Entity.paymentVoucher;
import com.water.customer.Service.paymentVoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/paymentvoucher")


public class paymentVoucherController {

    @Autowired
    private paymentVoucherService voucherService;

    @PostMapping("/save")
    public ResponseEntity<?> createvoucher(@RequestBody voucherDTO voucherDTO){
        try{
            paymentVoucher savedVoucher = voucherService.saveVoucher(voucherDTO);
            return ResponseEntity.ok(savedVoucher);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating voucher: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<paymentVoucher>> getAllVouchers() {
        try {
            List<paymentVoucher> list = voucherService.getAllVouchers();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(null);
        }
    }

    @GetMapping("/monthly")
    public ResponseEntity<voucherAggregateDTO> getMonthlyTotal(
            @RequestParam int month,
            @RequestParam int year) {
        try {
            voucherAggregateDTO aggregate = voucherService.monthlycost(month, year);
            return ResponseEntity.ok(aggregate);
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(new voucherAggregateDTO("", 0.0));
        }
    }

    @GetMapping("/report/monthly")
    public ResponseEntity<MonthlyVoucherReportDTO> getMonthlyReport(
            @RequestParam int month,
            @RequestParam int year
    ) {
        MonthlyVoucherReportDTO dto = voucherService.monthlyReport(month, year);
        return ResponseEntity.ok(dto);
    }


    @GetMapping("/report/yearly")
    public ResponseEntity<MonthlyVoucherReportDTO> getYearlyReport(
            @RequestParam int year
    ) {
        MonthlyVoucherReportDTO dto = voucherService.yearlyReport(year);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/yearly")
    public ResponseEntity<voucherAggregateDTO> getYearlyTotal(
            @RequestParam int year) {
        try {
            voucherAggregateDTO aggregate = voucherService.yearlycost(year);
            return ResponseEntity.ok(aggregate);
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(new voucherAggregateDTO("", 0.0));
        }
    }

    @GetMapping("/description/monthly")
    public ResponseEntity<MonthlyVoucherReportDTO> getMonthlyReportByDescription(
            @RequestParam int month,
            @RequestParam int year,
            @RequestParam String description
    ) {
        MonthlyVoucherReportDTO dto = voucherService.monthlyReportByDescription(month, year, description);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/description/yearly")
    public ResponseEntity<MonthlyVoucherReportDTO> getYearlyReportByDescription(
            @RequestParam int year,
            @RequestParam String description
    ) {
        MonthlyVoucherReportDTO dto = voucherService.yearlyReportByDescription(year, description);
        return ResponseEntity.ok(dto);
    }

}
