import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Product from '@/models/Product';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const rawQ = (searchParams.get('q') || '').trim();

    // Debug logging
    console.log('SEARCH SUGGEST API', {
      host: req.headers.get('host'),
      q: rawQ
    });

    if (!rawQ) {
      return NextResponse.json([]);
    }

    const q = rawQ.toLowerCase();

    // Flipkart-like behavior (simplified):
    // 1. Prefix match on name and brand.
    // 2. Group by unique suggestion strings.
    // 3. Rank by popularity and text similarity.

    const regex = new RegExp('^' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    const docs = await Product.find({
      $or: [{ name: regex }, { brand: regex }, { searchKeywords: regex }],
    })
      .sort({ popularity: -1, rating: -1 }) // importance first
      .limit(10)
      .lean();

    console.log('SEARCH SUGGEST RESULTS COUNT', docs.length);

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
        // optional: attach category to hint result page filters
        // category: doc.category
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
