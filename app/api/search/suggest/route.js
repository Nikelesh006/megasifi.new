import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Product from '@/models/Product';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const rawQ = (searchParams.get('q') || '').trim();

    if (!rawQ) {
      return NextResponse.json([]);
    }

    const q = rawQ.toLowerCase();

    const regex = new RegExp('^' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

  const docs = await Product.find({
      $or: [{ name: regex }, { brand: regex }, { searchKeywords: regex }],
    })
      .sort({ popularity: -1, rating: -1 })
      .limit(10)
      .lean();

    const suggestionsSet = new Set();

    for (const doc of docs) {
      if (doc.name) suggestionsSet.add(doc.name);
      if (doc.brand && doc.name.toLowerCase().startsWith(q)) {
        suggestionsSet.add(`${doc.brand} ${doc.name}`);
      }
    }

    const suggestions = Array.from(suggestionsSet).slice(0, 8);

    return NextResponse.json(
      suggestions.map((text) => ({
        text,
      }))
    );
  } catch (err) {
    console.error('Search suggest API error', err);
    return NextResponse.json(
      { message: 'Suggest failed', error: err?.message },
      { status: 500 }
    );
  }
}
