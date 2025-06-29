package com.water.customer.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "infobip")
@Data
public class Infobipconfig {
    private String apiKey;
    private String baseUrl;
    private String sender;
}
