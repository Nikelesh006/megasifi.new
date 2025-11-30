'use client';
import React, { useEffect, useState } from 'react';
import { Heart, RefreshCw } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import Loading from '@/components/Loading';
import ProductCard from '@/components/ProductCard';

const LikedProducts = () => {
  const { user, products, likedItems, isLiked, toggleLike, router } = useAppContext();

  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLikedProducts = () => {
    try {
      setLoading(true);

      // First try to use products from AppContext (more efficient)
      if (products && products.length > 0) {
        const liked = products.filter((product) =>
          likedItems.includes(product._id)
        );
        setLikedProducts(liked);
        setLoading(false);
        return;
      }

      // Fallback: fetch products from API if AppContext products aren't available
      if (likedItems.length === 0) {
        setLikedProducts([]);
        setLoading(false);
        return;
      }

      fetch('/api/product/list')
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            const liked = data.data.filter((product) =>
              likedItems.includes(product._id)
            );
            setLikedProducts(liked);
          } else {
            console.error('API Error:', data.message);
            setLikedProducts([]);
          }
        })
        .catch(error => {
          console.error('Failed to fetch products:', error);
          setLikedProducts([]);
        })
        .finally(() => {
          setLoading(false);
          setRefreshing(false);
        });
    } catch (error) {
      console.error('Failed to fetch liked products:', error);
      setLikedProducts([]);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLikedProducts();
  };

  useEffect(() => {
    if (user) {
      fetchLikedProducts();
    } else {
      setLoading(false);
    }
  }, [user, likedItems, products]);

  const removeFromLiked = (productId) => {
    if (isLiked(productId)) {
      toggleLike(productId);
    }
    // The likedProducts will update automatically through the useEffect
  };

  return (
    <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen bg-white">
      <div className="space-y-5">
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-600" />
            <h2 className="text-lg font-medium">Liked Products ({likedProducts.length})</h2>
          </div>
          {user && !loading && (
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          )}
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
                  onClick={() => removeFromLiked(product._id)}
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
