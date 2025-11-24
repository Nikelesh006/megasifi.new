import React, { useState, useEffect } from 'react';
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import { Heart, ShoppingCart } from 'lucide-react';
import { addToWishlist, removeFromWishlist, isLiked } from '@/lib/wishlistManager';
import Image from 'next/image';

const CategoryProductCard = ({ product }) => {
  const { addToCart, router } = useAppContext();
  const [likedItems, setLikedItems] = useState(new Set());

  // Sync liked items with wishlist manager
  useEffect(() => {
    const updateLikedItems = () => {
      if (isLiked(product._id)) {
        setLikedItems(new Set([product._id]));
      } else {
        setLikedItems(new Set());
      }
    };

    updateLikedItems();
  }, [product._id]);

  const toggleLike = (productId, e) => {
    e.stopPropagation();
    
    if (isLiked(productId)) {
      removeFromWishlist(productId);
      setLikedItems(new Set());
    } else {
      addToWishlist(productId);
      setLikedItems(new Set([productId]));
    }
  };

  const handleAddToCart = (productId, e) => {
    e.stopPropagation();
    addToCart(productId);
  };

  return (
    <div
      className="flex flex-col items-start gap-2 cursor-pointer group transition-all duration-300 bg-white rounded-lg shadow-sm hover:shadow-lg hover:shadow-rose-100 border border-gray-100 hover:border-rose-200 transform hover:-translate-y-1"
      onClick={() => router.push('/product/' + product._id)}
    >
      {/* Image container */}
      <div className="relative w-full h-48 flex items-center justify-center overflow-hidden rounded-t-lg bg-gray-50">
        <Image
          src={product.image[0]}
          alt={product.name}
          className="object-contain max-h-full max-w-full p-4"
          width={400}
          height={400}
        />
        
        {/* Like button */}
        <button
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-rose-50 transition-colors"
          onClick={(e) => toggleLike(product._id, e)}
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              likedItems.has(product._id) 
                ? 'text-rose-600 fill-current' 
                : 'text-gray-400 hover:text-rose-600'
            }`}
          />
        </button>
        
        {/* Discount badge if applicable */}
        {product.originalPrice && product.originalPrice > product.offerPrice && (
          <div className="absolute top-2 left-2 bg-rose-600 text-white text-xs px-2 py-1 rounded-full">
            -{Math.round(((product.originalPrice - product.offerPrice) / product.originalPrice) * 100)}%
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="w-full p-3">
        <h3 className="text-sm font-medium text-gray-800 truncate group-hover:text-rose-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 truncate mt-1">
          {product.description}
        </p>
        
        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-semibold text-rose-600">
            ${product.offerPrice}
          </span>
          {product.originalPrice && product.originalPrice > product.offerPrice && (
            <span className="text-xs text-gray-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
        
        {/* Add to cart button */}
        <button
          className="w-full mt-3 px-4 py-2 border border-rose-600 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
          onClick={(e) => handleAddToCart(product._id, e)}
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default CategoryProductCard;
