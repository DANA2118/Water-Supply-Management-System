package com.water.customer.Repository;

import com.water.customer.Entity.paymentVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
}
