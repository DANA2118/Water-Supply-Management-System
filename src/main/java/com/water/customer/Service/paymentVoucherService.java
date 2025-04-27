package com.water.customer.Service;


import com.water.customer.DTO.voucherAggregateDTO;
import com.water.customer.DTO.voucherDTO;
import com.water.customer.DTO.voucherdesDTO;
import com.water.customer.Entity.paymentVoucher;
import com.water.customer.Entity.paymentvoucherdes;
import com.water.customer.Entity.societyofficer;
import com.water.customer.Entity.user;
import com.water.customer.Repository.paymentVoucherRepository;
import com.water.customer.Repository.societyofficerRepository;
import com.water.customer.Repository.userRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class paymentVoucherService {
    @Autowired
    private paymentVoucherRepository voucherrepo;

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

    public voucherAggregateDTO monthlycost(int month, int year)
    {
        double monthlyTotal = voucherrepo.findMonthlyTotal(month, year);
        String period = String.format("%02d-%02d", month, year);
        return new voucherAggregateDTO(period, monthlyTotal);

    }

    public voucherAggregateDTO yearlycost(int year)
    {
        double yearlyTotal = voucherrepo.findYearlyTotal(year);
        String period = String.valueOf(year);
        return new voucherAggregateDTO(period, yearlyTotal);
    }

}
