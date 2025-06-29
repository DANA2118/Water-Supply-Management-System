package com.water.customer.Repository;

import com.water.customer.DTO.AerearsDTO;
import com.water.customer.DTO.InvoicesummaryDTO;
import com.water.customer.Entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface invoiceRepository extends JpaRepository<Invoice, Integer> {
    Optional<Invoice> findTopByCustomer_AccountNoAndStatusOrderByInvoiceIdDesc(int accountNo, Invoice.Status status);

    @Query("SELECT new com.water.customer.DTO.AerearsDTO(i.invoiceId, i.accountNo, c.name, c.telephoneNo, c.address, i.balanceforpay, i.duedate) "
            + "FROM Invoice i JOIN customer c ON i.accountNo = c.accountNo "
            + "WHERE i.balanceforpay >= 3000 AND i.duedate < CURRENT_DATE")
    List <AerearsDTO> findAerearsInvoices();

    @Query("SELECT new com.water.customer.DTO.InvoicesummaryDTO(i.invoiceId,c.name,i.accountNo,i.balanceforpay,i.duedate,i.status) " +
            "FROM Invoice i JOIN customer c ON i.accountNo = c.accountNo"
            + " WHERE i.invoiceId IN (SELECT MAX(i2.invoiceId) FROM Invoice i2 WHERE i2.accountNo = i.accountNo GROUP BY i2.accountNo)")
    List<InvoicesummaryDTO> getAllInvoiceSummaries();

    @Query("SELECT i FROM Invoice i WHERE i.accountNo = :accountNo ORDER BY i.issuedate DESC")
    List<Invoice> findAllByAccountNoOrderByIssueDateDesc(int accountNo);

    boolean existsByAccountNoAndIssuedateBetween(int accountNo, LocalDate start, LocalDate end);

    List<Invoice> findByAccountNoOrderByIssuedateDesc(int accountNo);

    Optional<Invoice> findTopByAccountNoOrderByIssuedateDesc(int accountNo);

    Optional<Invoice> findFirstByAccountNoAndStatusOrderByIssuedateDesc(Integer accountNo, Invoice.Status status);

    List<Invoice> findByAccountNoAndStatus(Integer accountNo, Invoice.Status status);

    List<Invoice> findByAccountNoAndIssuedateBetweenOrderByIssuedateAsc(int accountNo, LocalDate start, LocalDate end);

}
