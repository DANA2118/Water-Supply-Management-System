package com.water.customer.Repository;

import com.water.customer.Entity.paymentvoucherdes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface paymentvoucherdesRepository extends JpaRepository<paymentvoucherdes, Integer> {
    @Query("""
      SELECT d 
        FROM paymentvoucherdes d 
       WHERE LOWER(d.description) = LOWER(:desc)
         AND FUNCTION('YEAR',  d.voucher.voucherDate) = :year
    """)
    List<paymentvoucherdes> findByDescriptionAndYear(
            @Param("desc") String description,
            @Param("year") int year
    );

    @Query("""
      SELECT d 
        FROM paymentvoucherdes d 
       WHERE LOWER(d.description) = LOWER(:desc)
         AND FUNCTION('YEAR',  d.voucher.voucherDate) = :year
         AND FUNCTION('MONTH', d.voucher.voucherDate) = :month
    """)
    List<paymentvoucherdes> findByDescriptionAndMonthYear(
            @Param("desc")  String description,
            @Param("year")  int year,
            @Param("month") int month
    );

    @Query("""
  SELECT d.id   AS vid,
         d.description,
         SUM(d.cost)
    FROM paymentvoucherdes d
   WHERE FUNCTION('YEAR', d.voucher.voucherDate) = :year
GROUP BY d.description
""")
    List<Object[]> findCostBreakdownByYear(@Param("year") int year);

}
