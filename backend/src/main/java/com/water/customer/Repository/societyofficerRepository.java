package com.water.customer.Repository;

import com.water.customer.Entity.societyofficer;
import com.water.customer.Entity.user;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface societyofficerRepository extends JpaRepository<societyofficer, Integer> {

    societyofficer findByUser(user loggedInUser);
}
