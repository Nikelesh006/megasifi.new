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
      items,           // cart items with proper structure
      userId,          // user id
      sellerId,        // seller id
      address,         // selected address object
      date,            // timestamp
    } = body;

    if (!amount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 },
      );
    }

    // Validate required fields for Order.js schema
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 },
      );
    }

    if (!sellerId) {
      return NextResponse.json(
        { error: 'Seller ID is required' },
        { status: 400 },
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 },
      );
    }

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 },
      );
    }

    // Create internal order in DB (pending) with all required fields
    const OrderModel = (await import('@/models/Order')).default;
    const internalOrder = await OrderModel.create({
      userId,
      sellerId,
      items,
      totalAmount: amount,  // Use totalAmount to match TypeScript schema
      address,             // address object
      date: date || Date.now(),
      status: 'pending',   // Use 'pending' to match TypeScript schema
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
