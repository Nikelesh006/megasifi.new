import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Product from '@/models/Product';

function parseQueryForPrice(raw) {
  let q = raw.toLowerCase();

  // Patterns to detect phrases like "under 250", "below 1000", "less than 500", "upto 300"
  const patterns = [
    { regex: /(under|below|less than|upto|up to)\s+(\d+)/i, numIndex: 2 },
    { regex: /(\d+)\s*(or less|and less)/i, numIndex: 1 },
  ];

  for (const pattern of patterns) {
    const match = raw.match(pattern.regex);
    if (match) {
      const numStr = match[pattern.numIndex];
      const maxPrice = Number(numStr);
      if (!Number.isNaN(maxPrice) && maxPrice > 0) {
        // Remove the matched price phrase from text query
        const cleaned = raw.replace(match[0], '').replace(/\s+/g, ' ').trim();
        return { textQuery: cleaned, maxPrice };
      }
    }
  }

  // Fallback: no explicit "under" etc., just text
  return { textQuery: raw.trim(), maxPrice: undefined };
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const rawQ = (searchParams.get('q') || '').trim();
    const category = (searchParams.get('category') || '').trim();
    const page = Number(searchParams.get('page') || 1) || 1;
    const limit = Number(searchParams.get('limit') || 24) || 24;
    const skip = (page - 1) * limit;

    // Debug logging
    console.log('SEARCH API', {
      host: req.headers.get('host'),
      q: rawQ,
      category,
      page,
      limit
    });

    const { textQuery, maxPrice } = parseQueryForPrice(rawQ);

    const filter = {};

    // Text search if there is any remaining text
    if (textQuery) {
      filter.$text = { $search: textQuery };
    }
    
    // Category filter
    if (category) {
      filter.category = category;
    }

    // Price filter if maxPrice identified
    if (maxPrice !== undefined) {
      // use offerPrice if available, else price (based on Product model)
      filter.$expr = {
        $lte: [
          {
            $ifNull: ['$offerPrice', '$price'],
          },
          maxPrice,
        ],
      };
    }

    console.log('SEARCH FILTER', filter);

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort(
          textQuery
            ? { score: { $meta: 'textScore' }, popularity: -1, rating: -1 }
            : { popularity: -1, rating: -1, createdAt: -1 }
        )
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    console.log('SEARCH RESULTS COUNT', total);

    return NextResponse.json({
      items,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      parsedQuery: { textQuery, maxPrice }, // Optional: for debugging
    });
  } catch (err) {
    console.error('Search API error', err);
    return NextResponse.json(
      { message: 'Search failed', error: err?.message },
      { status: 500 }
    );
  }
}
