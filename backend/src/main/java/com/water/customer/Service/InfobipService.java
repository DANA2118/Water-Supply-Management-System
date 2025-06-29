package com.water.customer.Service;

import com.water.customer.config.Infobipconfig;
import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class InfobipService {

    private final Infobipconfig infobipconfig;
    private final okhttp3.OkHttpClient client;

    @Autowired
    public InfobipService(Infobipconfig infobipconfig) {
        this.infobipconfig = infobipconfig;
        this.client = new okhttp3.OkHttpClient();
    }

    public String sendSms(String to, String message) throws Exception {
        MediaType mediaType = MediaType.parse("application/json");
        String json = "{ \"messages\": [{ \"from\": \"" + infobipconfig.getSender() + "\", \"to\": \"" + to + "\", \"text\": \"" + message + "\" }] }";

        RequestBody body = RequestBody.create(mediaType, json);
        Request request = new Request.Builder()
                .url(infobipconfig.getBaseUrl() + "/sms/2/text/advanced")
                .post(body)
                .addHeader("Authorization", "App " + infobipconfig.getApiKey())
                .addHeader("Content-Type", "application/json")
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Failed to send SMS: " + response.message());
            }

            return response.body() != null ? response.body().string() : "SMS sent successfully";

        }
    }

}
