import connectDB from '@/config/db';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import User from '@/models/user';

export async function GET(request) {
  try {
    await connectDB();

    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthenticated' }, { status: 401 });
    }

    const user = await User.findById(userId).select('addresses').lean();
    const addresses = user?.addresses ?? [];

    return NextResponse.json({ success: true, addresses }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}