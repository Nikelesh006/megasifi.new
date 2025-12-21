import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Product from '@/models/Product';

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const category = searchParams.get('category') || '';
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 24);
  const skip = (page - 1) * limit;

  const filter = {};
  if (q) {
    filter.$text = { $search: q };
  }
  if (category) {
    filter.category = category;
  }

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort({
        score: { $meta: 'textScore' }, // relevance
        popularity: -1,
        rating: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return NextResponse.json({
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
