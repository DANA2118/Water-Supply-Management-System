package com.water.customer.config;

import com.water.customer.Service.userDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private userDetailsService userDetailsService;

    @Autowired
    private JWTAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth

                        // Public
                        .requestMatchers("/api/auth/register/customer", "/api/auth/login").permitAll()

                        // CUSTOMER
                        .requestMatchers("/api/v1/customer/**", "/api/complaint/save", "/api/payments/create", "/api/payments/confirm")
                        .hasAuthority("CUSTOMER")

                        // CASHIER
                        .requestMatchers(
                                "/api/payments/cash",
                                "/api/customer/get",
                                "/api/revenue/**",
                                "/api/customer/total",
                                "/api/customer/active",
                                "/api/complaint/all",
                                "/api/paymentvoucher/**",
                                "/api/invoice/getlatestinvoice/**",
                                "/api/invoice/getall",
                                "/api/invoice/consumptionpattern",
                                "/api/tariff/current",
                                "/api/tariff/all",
                                "/api/costreport/**"
                        ).hasAnyAuthority("CASHIER", "SOCIETY_OFFICER", "ADMIN")

                        // SOCIETY_OFFICER
                        .requestMatchers(
                                "/api/customer/**",
                                "/api/arrears/**",
                                "/api/revenue/**",
                                "/api/invoice/**",
                                "/api/tariff/**",
                                "/api/costreport/**",
                                "/api/paymentvoucher/**"
                        ).hasAnyAuthority("SOCIETY_OFFICER", "ADMIN")

                        // ADMIN
                        .requestMatchers("/api/auth/register/staff").hasAuthority("ADMIN")

                        // Everything else requires auth
                        .anyRequest().authenticated()
                )


                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider p = new DaoAuthenticationProvider();
        p.setUserDetailsService(userDetailsService);
        p.setPasswordEncoder(passwordEncoder());
        return p;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }
}
