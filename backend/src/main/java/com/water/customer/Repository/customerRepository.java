package com.water.customer.Repository;

import com.water.customer.Entity.customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface customerRepository extends JpaRepository<customer,Integer> {
    boolean existsByAccountNo(int accountNo);
    @Query("SELECT COUNT(c) FROM customer c")
    int getTotalCustomers();

    @Query("SELECT COUNT(c) FROM customer c WHERE c.status = 'Active'")
    long countActiveCustomers();

    Optional<customer> findByAccountNo(int accountNo);

    customer findByAccountNo(Integer accountNo);
}
