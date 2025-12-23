'use client';

import { useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

export default function RazorpayCheckoutButton({
  amount,
  items,
  userId,
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      // 1) Create order on our server
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'INR', items, userId }),
      });

      const data = await orderRes.json();
      if (!orderRes.ok || !data.razorpayOrder?.id) {
        console.error('Order creation failed', data);
        alert('Unable to start payment. Please try again.');
        return;
      }

      const { razorpayOrder, internalOrderId } = data;

      // 2) Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Megasifi',
        description: 'Order payment',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          // 3) Verify signature on server
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              internalOrderId,
            }),
          });

          const result = await verifyRes.json();
          if (result.success) {
            alert('Payment successful!');
            router.push('/order-placed'); // using existing success route
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#f9739b',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Payment could not be started.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button
        type="button"
        onClick={handlePlaceOrder}
        disabled={loading || amount <= 0}
        className="w-full py-3 mt-5 transition flex items-center justify-center gap-2 bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </>
  );
}
