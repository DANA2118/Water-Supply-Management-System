package com.water.customer.Repository;


import com.water.customer.Entity.complaints;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface complaintRepository extends JpaRepository<complaints, Integer> {

    List<complaints> findAllByOrderByDateDesc();
}

