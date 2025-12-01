import connectDB from '@/config/db';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Address from '@/models/Address';

export async function GET(request) {
  try {
    await connectDB();

    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthenticated' }, { status: 401 });
    }

    const addresses = await Address.find({ userId }).lean();

    return NextResponse.json({ success: true, addresses }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}