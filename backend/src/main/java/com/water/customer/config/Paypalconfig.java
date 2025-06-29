// src/main/java/com/water/customer/Config/PayPalConfig.java
package com.water.customer.config;

import com.paypal.core.PayPalEnvironment;
import com.paypal.core.PayPalHttpClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;

@Configuration
public class Paypalconfig {

    @Value("${paypal.client-id}")
    private String clientId;

    @Value("${paypal.client-secret}")
    private String clientSecret;

    @Bean
    public PayPalHttpClient payPalClient() {
        PayPalEnvironment env = new PayPalEnvironment.Sandbox(clientId, clientSecret);
        return new PayPalHttpClient(env);
    }
}
