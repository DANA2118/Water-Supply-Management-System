import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { CreditCard , CheckCircle2} from 'lucide-react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

interface LastBill {
  invoiceId: number;
  consumption: number;
  amount: number;
  duedate: string;
  balanceforpay: number;

}


interface BillPaymentProps {
  clientSecret: string | null;
  pId ?: string
}

const BillPayment: React.FC<BillPaymentProps> = ({ clientSecret}) => {
  const [bill, setBill] = useState<LastBill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [Success, setSuccess] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const confirmCalled = useRef(false);


  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const pi = q.get('payment_intent');
    const status = q.get('redirect_status');
    if (status === 'succeeded' && pi && !confirmCalled.current) {
      confirmCalled.current = true;
      confirmPayment(pi);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const { data: invoice } = await axios.get<LastBill>(
          'http://localhost:8082/api/v1/customer/latestinvoice',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBill(invoice);
      } catch (e) {
        setError('Failed to load invoice.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const confirmPayment = async (piId: string) => {
    try {
      console.log('Confirming payment with ID:', piId);
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8082/api/payments/confirm',
        { paymentIntentId: piId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setProcessing(false);
      setError('');
    } catch (e) {
      setError('Payment succeeded but failed to update. Contact support.');
      setProcessing(false);
    }
  };

const handlePaymentClick = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log("handlePaymentClick called");
  if (!stripe || !elements || !clientSecret) return;
  setProcessing(true);
  setError('');

  // 1. Call elements.submit() first (for deferred flow)
  const { error: submitError } = await elements.submit();
  if (submitError) {
    setError(submitError.message || 'Payment form validation failed');
    setProcessing(false);
    return;
  }

  // 2. Now call confirmPayment
  const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
    elements,
    clientSecret,
    confirmParams: {
      return_url: window.location.href,
    },
    redirect: "if_required",
  });
  console.log("stripe.confirmPayment result:", { stripeError, paymentIntent });

  if (stripeError) {
    setError(stripeError.message || 'Payment failed');
    setProcessing(false);
    return;
  }

  if (
    paymentIntent &&
    paymentIntent.status === "succeeded" &&
    !confirmCalled.current
  ) {
    confirmCalled.current = true;
    console.log("Calling confirmPayment with:", paymentIntent.id);
    await confirmPayment(paymentIntent.id);
  }
};

    if (loading) return (
    <div className="flex flex-col items-center justify-center h-64">
      <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      <div className="text-lg text-blue-600">Loading…</div>
    </div>
  );

  if (Success) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
          <h3 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h3>
          <p className="text-gray-700 mb-4">Thank you for your payment. Your transaction has been recorded.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

    if (!bill || bill.balanceforpay <= 0) {
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


  const { invoiceId, consumption, amount, balanceforpay, duedate } = bill;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* - Summary - */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Current Bill Summary</h2>
          {[
            ['Invoice ID', `#${invoiceId}`],
            ['Usage Units', consumption],
            ['Rate per Unit', '10 LKR'],
            ['Fixed Amount', '500.00 LKR'],
            ['Amount This Month', `${amount.toFixed(2)} LKR`],
            ['Total Balance Due', `${balanceforpay.toFixed(2)} LKR`],
            ['Due Date', new Date(duedate).toLocaleDateString()],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-2">
              <span className="text-gray-600">{label}</span>
              <span className="font-semibold">{value}</span>
            </div>
          ))}
        </div>

        {/* - Payment - */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Make Payment</h2>
          <form onSubmit={handlePaymentClick}>
            <PaymentElement />
            <button
              type="submit"
              disabled={!stripe || !elements || processing}
              className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              {processing ? 'Processing…' : `Pay ${balanceforpay.toFixed(2)} LKR`}
            </button>
            {error && <div className="p-3 bg-red-50 text-red-600 rounded mb-4">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BillPayment;
