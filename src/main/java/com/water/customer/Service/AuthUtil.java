// src/main/java/com/water/customer/Service/AuthUtil.java
package com.water.customer.Service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class AuthUtil {
    public static Integer getCurrentAccountNo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getCredentials() == null) return null;

        // The credentials on the principal are the raw token string we set in JWTAuthFilter:
        String token = (String) auth.getCredentials();
        try {
            return new JWTUtils().extractAccountNo(token);
        } catch (Exception e) {
            return null;
        }
    }
}
