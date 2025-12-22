import ProductCard from '@/components/ProductCard';
import { Search } from 'lucide-react';

export const dynamic = 'force-dynamic'; // always fresh

async function fetchSearch(
  q,
  page,
  baseUrl
) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  params.set('page', String(page));

  const url = `${baseUrl}/api/search?${params.toString()}`;

  let res;
  try {
    res = await fetch(url, { cache: 'no-store' });
  } catch (err) {
    console.error('Search page: Network error', err);
    return { items: [], total: 0, page: 1, totalPages: 1 };
  }

  if (!res.ok) {
    console.error('Search page: API error', await res.text());
    return { items: [], total: 0, page: 1, totalPages: 1 };
  }

  return res.json();
}

export default async function SearchPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const rawQParam = resolvedSearchParams.q ?? '';
  const q = rawQParam.trim();
  const page = Number(resolvedSearchParams.page || 1) || 1;

  // Build base URL from NEXT_PUBLIC_SITE_URL or fallback
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    // default to localhost for dev; in prod set NEXT_PUBLIC_SITE_URL to https://megasifi.shop
    'http://localhost:3000';

  const { items, total, totalPages } = await fetchSearch(q, page, baseUrl);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-5 h-5 text-gray-400" />
        <h1 className="text-xl font-semibold">
          Search results for "{q || 'All products'}"
        </h1>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        {total} item{total !== 1 ? 's' : ''} found
      </p>

      {items.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <a
                  key={pageNum}
                  href={`/search?q=${encodeURIComponent(q)}&page=${pageNum}`}
                  className={`px-3 py-1 text-sm rounded border transition-colors ${
                    pageNum === page
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </a>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500">
            {q 
              ? `We couldn't find any products matching "${q}". Try searching with different keywords.`
              : 'Enter a search term to find products.'
            }
          </p>
        </div>
      )}
    </div>
  );
}
