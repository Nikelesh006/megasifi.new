import React, { useEffect, useState } from 'react';
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import { Heart, ShoppingCart, TrendingUp } from 'lucide-react';

const HomeProducts = ({ category = 'Popular Products' }) => {
  const { addToCart, router, toggleLike, isLiked, products, getCartCount, cartItems } = useAppContext();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const count = getCartCount();
    setCartCount(count);
  }, [cartItems, getCartCount]);

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
          <div
            key={product._id}
            className="flex flex-col items-start gap-2 cursor-pointer group transition-all duration-300 bg-white rounded-lg shadow-sm hover:shadow-lg hover:shadow-rose-100 border border-rose-200 hover:border-rose-400 transform hover:-translate-y-1"
            onClick={() => router.push('/product/' + product._id)}
          >
            {/* Image container */}
            <div className="relative w-full h-48 flex items-center justify-center overflow-hidden rounded-t-lg bg-gradient-to-br from-gray-50 to-white">
              <img
                src={product.image[0]}
                alt={product.name}
                className="object-contain max-h-full max-w-full p-4 transition-transform duration-300 group-hover:scale-105"
              />

              {/* Like button */}
              <button
                className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-rose-50 transition-all duration-300 transform hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(product._id);
                }}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isLiked(product._id)
                      ? 'text-rose-600 fill-current'
                      : 'text-gray-400 hover:text-rose-600'
                  }`}
                />
              </button>

            </div>

            {/* Product info */}
            <div className="w-full p-3 flex-1 flex flex-col">
              <h3 className="text-sm font-medium text-rose-700 truncate group-hover:text-rose-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 truncate mt-1 flex-1">
                {product.description}
              </p>

              {/* Price */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-base font-semibold text-rose-700">
                  ${product.offerPrice}
                </span>
                {product.price && product.price > product.offerPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    ${product.price}
                  </span>
                )}
              </div>

              {/* Add to cart button */}
              <button
                className="w-full mt-3 px-4 py-2 border border-rose-500 bg-white text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-colors flex items-center justify-center gap-2 relative"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product._id);
                }}
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
                
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
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
