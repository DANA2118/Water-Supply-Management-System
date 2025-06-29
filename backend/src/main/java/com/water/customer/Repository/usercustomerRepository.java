package com.water.customer.Repository;

import com.water.customer.Entity.user;
import com.water.customer.Entity.usercustomer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface usercustomerRepository extends JpaRepository<usercustomer, Integer> {
    usercustomer findByUser(user user);
}
