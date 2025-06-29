package com.water.customer.Repository;

import com.water.customer.Entity.Tariff;
import com.water.customer.Entity.customer;
import org.hibernate.usertype.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface tariffRepository extends JpaRepository<Tariff, Integer> {
    @Query("""
  SELECT t
    FROM Tariff t
   WHERE t.usertype = :type
     AND t.effectiveDate <= :asOf
   ORDER BY t.effectiveDate DESC
""")
    Optional<Tariff> findCurrentByType(
            @Param("type") customer.Usertype usertype,
            @Param("asOf") LocalDate asOf
    );

}
