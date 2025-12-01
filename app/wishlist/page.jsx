'use client';
import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import Loading from '@/components/Loading';
import ProductCard from '@/components/ProductCard';

const LikedProducts = () => {
  const { user, products, router, likedItems, toggleLike } = useAppContext();

  const [loading, setLoading] = useState(true);

  // Filter products based on liked items from backend
  const likedProducts = products.filter((product) =>
    likedItems.includes(product._id)
  );

  useEffect(() => {
    if (user) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, products, likedItems]);

  return (
    <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen bg-white">
      <div className="space-y-5">
        <div className="flex items-center gap-2 mt-6">
          <Heart className="w-6 h-6 text-rose-600" />
          <h2 className="text-lg font-medium">Liked Products</h2>
        </div>

        {!user ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Heart className="w-16 h-16 text-rose-300 mb-4" />
            <p className="text-lg mb-2">
              Please sign in to view your liked products
            </p>
            <button
              onClick={() => router.push('/sign-in')}
              className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        ) : loading ? (
          <Loading />
        ) : likedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Heart className="w-16 h-16 text-rose-300 mb-4" />
            <p className="text-lg mb-2">No liked products yet</p>
            <p className="text-sm text-gray-400">
              Start adding products you love to see them here
            </p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-6 w-full max-w-6xl mx-auto">
            {likedProducts.map((product) => (
              <div key={product._id} className="relative group">
                <ProductCard product={product} />
                <button
                  onClick={() => toggleLike(product._id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100 z-10"
                  aria-label="Remove from liked products"
                >
                  <Heart className="w-4 h-4 text-rose-600 fill-current" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedProducts;
