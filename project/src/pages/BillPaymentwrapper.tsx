import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import BillPayment from "./BillPayment";
import { CheckCircle2} from 'lucide-react';
import axios from "axios";

const stripePromise = loadStripe("pk_test_51RMX2zFKRpkaF77fMglduXSH8FV2lhvZWFA63fQzOGhOUzclE1YMhcGze8SujmiYuwsnazKNyRdI970ekGFOPzAi00EipSc13l");

const BillPaymentWrapper: React.FC = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [pID, setPID] = useState<string >("");

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const { data: invoice } = await axios.get(
          "http://localhost:8082/api/v1/customer/latestinvoice",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (invoice.balanceforpay > 0) {
          const { data: resp } = await axios.post(
            "http://localhost:8082/api/payments/create",
            {
              amount: Math.round(invoice.balanceforpay * 100),
              currency: "lkr",
              invoiceId: invoice.invoiceId
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("Payment Intent Response:", resp);
          setPID(resp.paymentIntentId);
          setClientSecret(resp.clientSecret);
        } else {
          setClientSecret("NO_PAYMENT_NEEDED");
        }
      } catch (err) {
        setClientSecret("ERROR");
      }
    })();
  }, []);

if (!clientSecret) return <div className="flex justify-center items-center h-64">Loading…</div>;
if (clientSecret === "ERROR") return <div className="p-4 text-center text-red-600">Failed to load payment info.</div>;
if (clientSecret === "NO_PAYMENT_NEEDED") {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="h-10 w-10 text-green-500" />
      </div>
      <h3 className="text-2xl font-bold text-green-700 mb-2">No Payment Due</h3>
      <p className="text-gray-700 text-lg">Your account is fully paid. Thank you!</p>
    </div>
  );
}
return (
  <Elements stripe={stripePromise} options={{ clientSecret }}>
    <BillPayment clientSecret={clientSecret} pId={pID} />
  </Elements>
);

};

export default BillPaymentWrapper;
