import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { error: 'Razorpay key secret is not set' },
        { status: 500 },
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      internalOrderId,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 },
      );
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      if (internalOrderId) {
        const OrderModel = (await import('@/models/Order')).default;
        await OrderModel.findByIdAndUpdate(internalOrderId, {
          status: 'failed',
          paymentInfo: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
        });
      }
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 },
      );
    }

    if (internalOrderId) {
      const OrderModel = (await import('@/models/Order')).default;
      await OrderModel.findByIdAndUpdate(internalOrderId, {
        status: 'paid',
        paymentInfo: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Razorpay verify error', err);
    return NextResponse.json(
      { error: err?.message || 'Verification failed' },
      { status: 500 },
    );
  }
}
