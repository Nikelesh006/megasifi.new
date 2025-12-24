'use client';

import { useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

export default function RazorpayCheckoutButton({
  amount,
  items,
  userId,
  selectedAddress,
  products,
}) {
  const [loading, setLoading] = useState(false);
  const [rzpReady, setRzpReady] = useState(false);
  const router = useRouter();

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      if (!rzpReady || typeof window === 'undefined' || !window.Razorpay) {
        alert('Payment UI failed to load. Please refresh and try again.');
        return;
      }

      if (!selectedAddress) {
        alert('Please select a delivery address');
        return;
      }

      if (!userId) {
        alert('Please sign in to place an order');
        return;
      }

      // Prepare order items with required fields according to Order.js schema
      const orderItems = items.map(item => {
        const product = products.find(p => p._id === item.productId);
        return {
          product: item.productId,
          quantity: item.qty,
          price: item.price,
          color: item.color,
          size: item.size || '',
          image: item.image,
        };
      });

      // Get sellerId from first item (assuming single seller per order)
      const firstProduct = products.find(p => p._id === items[0]?.productId);
      const sellerId = firstProduct?.sellerId;

      // Prepare the complete order payload
      const orderPayload = {
        amount,
        currency: 'INR',
        userId,
        sellerId,
        address: selectedAddress,
        items: orderItems,
        date: Date.now(), // timestamp as required by Order.js schema
      };

      // 1) Create order on our server
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      let data;
      try {
        data = await orderRes.json();
      } catch (e) {
        data = null;
      }

      if (!orderRes.ok || !data.razorpayOrder?.id) {
        console.error('Order creation failed', data);
        alert(data?.error || data?.message || `Unable to start payment (HTTP ${orderRes.status}).`);
        return;
      }

      const { razorpayOrder, internalOrderId, keyId } = data;

      console.log('Razorpay key from server =', keyId);

      // 2) Open Razorpay checkout
      const options = {
        key: keyId,
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
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRzpReady(true)}
        onError={() => setRzpReady(false)}
      />
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
