package com.water.customer.Repository;

import com.water.customer.Entity.meterreading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface meterreadingRepository extends JpaRepository<meterreading, Integer> {
    Optional<meterreading> findTopByCustomerAccountNoOrderByDateDesc(int accountNo);
    boolean existsByAccountNoAndDateBetween(int accountNo, LocalDate start, LocalDate end);
}

