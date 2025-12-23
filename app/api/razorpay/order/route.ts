import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Razorpay keys are not set' },
        { status: 500 },
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const body = await req.json();
    const {
      amount,          // total in rupees
      currency = 'INR',
      items,           // cart items
      userId,          // optional user id
    } = body;

    if (!amount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 },
      );
    }

    // Create internal order in DB (pending)
    const OrderModel = (await import('@/models/Order')).default;
    const internalOrder = await OrderModel.create({
      userId: userId || null,
      items: items || [],
      totalAmount: amount,
      status: 'pending',
      paymentGateway: 'razorpay',
    });

    const receiptId = internalOrder._id.toString();

    const options = {
      amount: Math.round(amount * 100), // paise
      currency,
      receipt: receiptId,
      payment_capture: 1,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return NextResponse.json({
      razorpayOrder,
      internalOrderId: internalOrder._id,
      keyId,
    });
  } catch (err: any) {
    console.error('Razorpay order error', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to create order' },
      { status: 500 },
    );
  }
}
