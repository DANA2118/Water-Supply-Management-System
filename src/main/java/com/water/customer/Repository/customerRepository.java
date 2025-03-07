package com.water.customer.Repository;

import com.water.customer.Entity.customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface customerRepository extends JpaRepository<customer,Integer> {
    boolean existsByAccountNo(int accountNo);
}
