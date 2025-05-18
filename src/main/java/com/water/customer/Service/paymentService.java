package com.water.customer.Service;

import com.paypal.core.PayPalHttpClient;
import com.paypal.orders.*;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import com.water.customer.DTO.*;
import com.water.customer.Entity.Invoice;
import com.water.customer.Entity.payment;
import com.water.customer.Repository.invoiceRepository;
import com.water.customer.Repository.paymentRepository;
import com.water.customer.Service.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class paymentService {

    @Autowired private paymentRepository paymentRepo;
    @Autowired private invoiceRepository invoiceRepo;

    @Transactional
    public PaymentReciptDTO recordCash(cashPaymentRequestDTO req) {
        Invoice inv = invoiceRepo.findById(req.getInvoiceId())
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));

        double remaining = inv.getBalanceforpay() - req.getPaymentAmount();
        inv.setBalanceforpay(remaining);
        if (remaining <= 0) {
            inv.setStatus(Invoice.Status.PAID);
            settleAllInvoices(inv.getCustomer().getAccountNo());
        }
        invoiceRepo.save(inv);

        // 3) Persist the Payment (with both date & time)
        payment pay = payment.builder()
                .invoice(inv)
                .customer(inv.getCustomer())
                .paymentDate(LocalDate.now())
                .method(payment.PaymentMethod.CASH)
                .paymentAmount(req.getPaymentAmount())
                .build();
        paymentRepo.save(pay);

        // 4) Build & return the receipt DTO
        return PaymentReciptDTO.builder()
                .transactionId("TRN" + pay.getPaymentId())
                .customerName(inv.getCustomer().getName())
                .accountNo(inv.getCustomer().getAccountNo())
                .invoiceId(inv.getInvoiceId())
                .totalAmount(inv.getTotalamount())
                .amountPaid(req.getPaymentAmount())
                .balanceRemaining(inv.getBalanceforpay())
                .paymentDate(pay.getPaymentDate())
                .build();
    }


    public onlinePaymentResponseDTO createPaymentIntent(onlinePaymentRequestDTO req) throws StripeException {
        long smallestUnit = req.getAmount(); // e.g. LKR cents
        System.out.println("Creating payment intent for " + smallestUnit);
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(smallestUnit)
                .setCurrency(req.getCurrency())
                .addPaymentMethodType("card")
                .setCaptureMethod(PaymentIntentCreateParams.CaptureMethod.AUTOMATIC)
                .putMetadata("invoice_id", String.valueOf(req.getInvoiceId()))
                .build();

        PaymentIntent intent = PaymentIntent.create(params);
        System.out.println("Created payment intent: " + intent.getId());
        return onlinePaymentResponseDTO.builder()
                .clientSecret(intent.getClientSecret())
                .paymentIntentId(intent.getId())
                .build();
    }

    /**
     * 2) Confirm a Stripe payment and apply it to the customer's latest unpaid invoice.
     */
    @Transactional
    public paymentResponseDTO confirmStripePayment(ConfirmPaymentRequestDTO dto)
            throws StripeException
    {
        PaymentIntent intent = PaymentIntent.retrieve(dto.getPaymentIntentId());
        System.out.println("Confirming payment intent: " + intent.getId());
        if (!"succeeded".equals(intent.getStatus())) {
            throw new IllegalStateException("Stripe payment not succeeded: " + intent.getStatus());
        }

        long amt = intent.getAmountReceived();      // e.g. 127000
        double amountLkr = amt / 100.0;             // → 1270.00 LKR

        String invoiceIdStr = intent.getMetadata().get("invoice_id");
        if (invoiceIdStr == null) {
            throw new IllegalStateException("No invoice_id in PaymentIntent metadata");
        }
        int invoiceId = Integer.parseInt(invoiceIdStr);
        Invoice inv = invoiceRepo.findById(invoiceId)
                .orElseThrow(() -> new IllegalStateException("Invoice not found"));

        // e) Deduct the payment (allow over-pay => negative balance)
        double remaining = inv.getBalanceforpay() - amountLkr;
        inv.setBalanceforpay(remaining);
        if (remaining <= 0) {
            inv.setStatus(Invoice.Status.PAID);
            settleAllInvoices(inv.getCustomer().getAccountNo());
        }
        invoiceRepo.save(inv);

        // f) Persist a new Payment record
        payment pay = payment.builder()
                .invoice(inv)
                .customer(inv.getCustomer())
                .paymentDate(LocalDate.now())
                .method(payment.PaymentMethod.ONLINE)
                .paymentAmount(amountLkr)
                .build();
        paymentRepo.save(pay);

        // g) Return your existing DTO
        return com.water.customer.DTO.paymentResponseDTO.from(pay);
    }

    public void settleAllInvoices(int accountNo) {
        List<Invoice> unpaid = invoiceRepo.findByAccountNoAndStatus(
                accountNo, Invoice.Status.UNPAID);

        for (Invoice other : unpaid) {
            other.setStatus(Invoice.Status.PAID);
            other.setBalanceforpay(0);
        }
        invoiceRepo.saveAll(unpaid);
    }
}
