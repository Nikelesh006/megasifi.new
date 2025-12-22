import React, { useState } from 'react';
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import { Heart, ShoppingCart, TrendingUp, Loader2 } from 'lucide-react';
import Image from 'next/image';

const CategoryProductCard = ({ product }) => {
  const { addToCart, router, isLiked, toggleLike } = useAppContext();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    
    if (isAddingToCart) return; // Prevent double-click
    
    setIsAddingToCart(true);
    try {
      await addToCart(productId);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div
      className="flex flex-col items-start gap-2 cursor-pointer group transition-all duration-300 bg-white rounded-lg shadow-sm hover:shadow-lg hover:shadow-rose-100 border border-rose-200 hover:border-rose-400 transform hover:-translate-y-1"
      onClick={() => router.push('/product/' + product._id)}
    >
      {/* Image container */}
      <div className="relative w-full h-48 flex items-center justify-center overflow-hidden rounded-t-lg bg-gradient-to-br from-gray-50 to-white">
        <Image
          src={product.image[0]}
          alt={product.name}
          className="object-contain max-h-full max-w-full p-4 transition-transform duration-300 group-hover:scale-105"
          width={400}
          height={400}
        />
        
        {/* Like button */}
        <button
          className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-rose-50 transition-all duration-300 transform hover:scale-110"
          onClick={(e) => toggleLike(product._id, e)}
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isLiked(product._id) 
                ? 'text-rose-600 fill-current' 
                : 'text-gray-400 hover:text-rose-600'
            }`}
          />
        </button>
        
        {/* Discount badge if applicable */}
        {product.price && product.price > product.offerPrice && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
            <TrendingUp className="w-3 h-3" />
            -{Math.round(((product.price - product.offerPrice) / product.price) * 100)}%
          </div>
        )}
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
            ₹{product.offerPrice}
          </span>
          {product.price && product.price > product.offerPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.price}
            </span>
          )}
        </div>
        
        {/* Add to cart button */}
        <button
          className={`w-full mt-3 px-4 py-2 border rounded-lg transition-colors flex items-center justify-center gap-2 ${
            isAddingToCart 
              ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'border-rose-500 bg-white text-rose-500 hover:bg-rose-500 hover:text-white'
          }`}
          onClick={(e) => handleAddToCart(product._id, e)}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CategoryProductCard;
