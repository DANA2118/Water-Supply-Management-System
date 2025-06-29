package com.water.customer.Service;

import com.twilio.Twilio;
import com.water.customer.config.Twilioconfig;
import com.twilio.rest.api.v2010.account.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static com.twilio.rest.api.v2010.account.Token.creator;

@Service
public class TwilioService {
    private final Twilioconfig twilioconfig;

    @Autowired
    public TwilioService(Twilioconfig twilioconfig) {
        this.twilioconfig = twilioconfig;
        Twilio.init(
                twilioconfig.getAccountSid(),
                twilioconfig.getAuthToken()
        );
    }

    public String sendSms(String to, String message) {
        Message sms = Message.creator(
                new com.twilio.type.PhoneNumber(to),
                new com.twilio.type.PhoneNumber(twilioconfig.getTrialNumber()),
                message)
                .create();
        return sms.getSid();
    }
}
