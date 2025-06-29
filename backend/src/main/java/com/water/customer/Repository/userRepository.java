package com.water.customer.Repository;

import com.water.customer.Entity.user;
import org.springframework.data.jpa.repository.JpaRepository;

public interface userRepository extends JpaRepository<user, Integer> {
    user findByEmail(String email);
}
