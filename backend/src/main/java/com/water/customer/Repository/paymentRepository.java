package com.water.customer.Repository;

import com.water.customer.Entity.Invoice;
import com.water.customer.Entity.payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface paymentRepository extends JpaRepository<payment, Integer> {

    @Query("""
      SELECT COALESCE(SUM(p.paymentAmount), 0)
        FROM payment p
       WHERE FUNCTION('YEAR', p.paymentDate) = :year
    """)
    double findTotalRevenueForYear(@Param("year") int year);

    @Query("""
      SELECT FUNCTION('MONTH', p.paymentDate)       AS month,
             COALESCE(SUM(p.paymentAmount), 0)     AS revenue
        FROM payment p
       WHERE FUNCTION('YEAR', p.paymentDate) = :year
    GROUP BY FUNCTION('MONTH', p.paymentDate)
    ORDER BY FUNCTION('MONTH', p.paymentDate)
    """)
    List<Object[]> findMonthlyRevenue(@Param("year") int year);
}
