package com.water.customer.Repository;

import com.water.customer.Entity.customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface customerRepository extends JpaRepository<customer,Integer> {
    boolean existsByAccountNo(int accountNo);
    @Query("SELECT COUNT(c) FROM customer c")
    int getTotalCustomers();

    @Query("SELECT COUNT(c) FROM customer c WHERE c.status = 'Active'")
    long countActiveCustomers();
}
