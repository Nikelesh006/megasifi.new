import React, { useEffect, useState } from 'react';
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import { Heart, ShoppingCart, TrendingUp } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

const HomeProducts = ({ category = 'Popular Products' }) => {
  const { addToCart, router, toggleLike, isLiked, products, getCartCount, cartItems, currency, isLoadingProducts } = useAppContext();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const count = getCartCount();
    setCartCount(count);
  }, [cartItems, getCartCount]);

  // Show loading state while products are being fetched
  if (isLoadingProducts) {
    return (
      <div className="flex flex-col items-center pt-14">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-rose-600" />
          <h2 className="text-2xl font-medium text-rose-800">{category}</h2>
          <TrendingUp className="w-6 h-6 text-rose-600" />
        </div>
        <p className="text-gray-500 text-center py-8">Loading products...</p>
      </div>
    );
  }

  // Filter products based on category and subCategory
  const filteredProducts = products.filter(product => 
    product.category === 'Home' && product.subCategory === category
  );

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center pt-14">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-rose-600" />
          <h2 className="text-2xl font-medium text-rose-800">{category}</h2>
          <TrendingUp className="w-6 h-6 text-rose-600" />
        </div>
        <p className="text-gray-500 text-center py-8">No products available in this category.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-14">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-rose-600" />
        <h2 className="text-2xl font-medium text-rose-800">{category}</h2>
        <TrendingUp className="w-6 h-6 text-rose-600" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-6 pb-14 w-full max-w-6xl">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <button
        onClick={() => router.push('/all-products')}
        className="px-8 py-2.5 border border-rose-600 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-2"
      >
        <TrendingUp className="w-4 h-4" />
        See More Products
      </button>
    </div>
  );
};

export default HomeProducts;
