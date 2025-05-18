package com.water.customer.Controller;

import com.stripe.exception.StripeException;
import com.water.customer.DTO.*;
import com.water.customer.Service.paymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class paymentController {

    @Autowired private paymentService paySvc;

    @PostMapping("/cash")
    public ResponseEntity<PaymentReciptDTO> payByCash(
            @RequestBody cashPaymentRequestDTO req
    ) {
        PaymentReciptDTO receipt = paySvc.recordCash(req);
        return ResponseEntity.ok(receipt);
    }

    @PostMapping("/create")
    public ResponseEntity<onlinePaymentResponseDTO> create(@RequestBody onlinePaymentRequestDTO req) {
        try {
            System.out.println("Creating payment intent");
            return ResponseEntity.ok(paySvc.createPaymentIntent(req));
        } catch (StripeException e) {
            return ResponseEntity.status(502).build();
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<paymentResponseDTO> confirm(
            @RequestBody ConfirmPaymentRequestDTO dto) {
        try {
            return ResponseEntity.ok(paySvc.confirmStripePayment(dto));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(502).build();
        }
    }
}
