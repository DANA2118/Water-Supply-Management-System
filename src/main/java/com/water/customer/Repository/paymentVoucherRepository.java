package com.water.customer.Repository;

import com.water.customer.Entity.paymentVoucher;
import com.water.customer.Entity.paymentvoucherdes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface paymentVoucherRepository extends JpaRepository<paymentVoucher, Integer> {

    @Query("""
    SELECT SUM(v.totalcost)
      FROM paymentVoucher v
     WHERE FUNCTION('MONTH', v.voucherDate) = :month
       AND FUNCTION('YEAR',  v.voucherDate) = :year
  """)
    double findMonthlyTotal (@Param("month") int month, @Param("year") int year);

    @Query("""
    SELECT SUM(v.totalcost)
      FROM paymentVoucher v
     WHERE FUNCTION('YEAR',  v.voucherDate) = :year
    """)
    double findYearlyTotal (@Param("year") int year);

    @Query("""
    SELECT v
      FROM paymentVoucher v
     WHERE FUNCTION('MONTH', v.voucherDate) = :month
       AND FUNCTION('YEAR',  v.voucherDate) = :year
  """)
    List<paymentVoucher> findAllByMonthYear(@Param("month") int month, @Param("year")  int year);

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
      SELECT COALESCE(SUM(v.totalcost), 0)
        FROM paymentVoucher v
       WHERE FUNCTION('YEAR', v.voucherDate) = :year
    """)
    double findTotalCostForYear(@Param("year") int year);

    @Query("""
      SELECT FUNCTION('MONTH', v.voucherDate) AS month,
      COALESCE(SUM(v.totalcost), 0) AS totalcost
      FROM paymentVoucher v
        WHERE FUNCTION('YEAR', v.voucherDate) = :year
        GROUP BY FUNCTION('MONTH', v.voucherDate)
        ORDER BY FUNCTION('MONTH', v.voucherDate)
    """)
    List<Object[]> findMonthlyCost(@Param("year") int year);

}
