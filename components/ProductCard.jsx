"use client"
import React, { useEffect, useState } from 'react';
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import { Heart, ShoppingCart, Loader2 } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { currency, router, addToCart, isLiked, toggleLike } = useAppContext();
  const [liked, setLiked] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Sync local liked state with global state
  useEffect(() => {
    if (product?._id) {
      setLiked(isLiked(product._id));
    }
  }, [product?._id, isLiked]);

  const handleToggleLike = (e) => {
    e.stopPropagation();
    if (!product?._id) return;

    // Use global toggleLike function
    toggleLike(product._id);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (isNavigating) return; // Prevent double-click
    
    setIsNavigating(true);
    
    try {
      // Redirect immediately
      await router.push('/product/' + product._id);
      
      // Check if mobile device
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      
      // Show toast message after navigation starts
      toast(
        <div className={`flex items-start gap-3 w-full ${isMobile ? 'py-2' : 'py-2'}`}>
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">!</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-medium text-gray-900 ${isMobile ? 'text-sm' : 'text-sm'}`}>Please select options</p>
            <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-xs'}`}>Choose color and size to continue</p>
          </div>
        </div>,
        {
          duration: 4000, // 4 seconds for both mobile and desktop
          position: isMobile ? 'top-center' : 'top-center',
          style: (t) => ({
            background: '#fff',
            color: '#1f2937',
            borderLeft: '4px solid #dc2626',
            borderTop: '2px solid #dc2626',
            borderRight: '2px solid #dc2626',
            borderBottom: '2px solid #dc2626',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 12px -1px rgba(220, 38, 38, 0.15), 0 2px 6px -1px rgba(220, 38, 38, 0.1)',
            padding: isMobile ? '0.75rem 1rem' : '0.85rem 1.15rem',
            fontSize: isMobile ? '0.875rem' : '0.95rem',
            maxWidth: isMobile ? 'calc(100% - 2rem)' : '30rem',
            width: isMobile ? '100%' : 'auto',
            margin: isMobile ? '0 auto 0' : '0 auto',
            boxSizing: 'border-box',
            left: '50%',
            transform: 'translateX(-50%)',
            right: 'auto',
            top: isMobile ? '1rem' : '5rem',
            bottom: isMobile ? 'auto' : 'auto',
            zIndex: 9999,
          }),
        }
      );
    } catch (error) {
      console.error('Error navigating to product:', error);
    } finally {
      setIsNavigating(false);
    }
  };

  return (
    <div
      onClick={() => {
        router.push('/product/' + product._id);
        scrollTo(0, 0);
      }}
      className="flex flex-col items-start gap-2 cursor-pointer group transition-all duration-300 bg-white rounded-lg shadow-sm hover:shadow-lg hover:shadow-rose-100 border border-rose-200 hover:border-rose-400 transform hover:-translate-y-1 md:shadow-sm md:hover:shadow-lg md:hover:shadow-rose-100 md:border md:border-rose-200 md:hover:border-rose-400 md:transform md:hover:-translate-y-1"
    >
      {/* Image container */}
      <div className="relative w-full h-48 flex items-center justify-center overflow-hidden rounded-t-lg bg-gradient-to-br from-gray-50 to-white md:h-48">
        <Image
          src={product.image[0]}
          alt={product.name}
          className="object-contain max-h-full max-w-full p-4 transition-transform duration-300 group-hover:scale-105"
          width={400}
          height={400}
          style={{
            width: 'auto',
            height: 'auto',
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        />

        {/* Like button */}
        <button
          className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-rose-50 transition-all duration-300 transform hover:scale-110 md:p-2 md:bg-white/90 md:backdrop-blur-sm md:rounded-full md:shadow-md md:hover:bg-rose-50 md:transition-all md:duration-300 md:transform md:hover:scale-110"
          onClick={handleToggleLike}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              liked
                ? 'text-rose-600 fill-current'
                : 'text-gray-400 hover:text-rose-600'
            }`}
          />
        </button>

        {/* Discount badge if applicable */}
        {product.price && product.price > product.offerPrice && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
            <span className="text-xs font-medium">
              -{Math.round(((product.price - product.offerPrice) / product.price) * 100)}%
            </span>
          </div>
        )}

      </div>

      {/* Product info */}
      <div className="w-full p-3 flex-1 flex flex-col md:p-3">
        <h3 className="text-sm font-medium text-rose-700 truncate group-hover:text-rose-600 transition-colors md:text-sm md:font-medium md:text-rose-700 md:truncate md:group-hover:text-rose-600 md:transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 truncate mt-1 flex-1 md:text-xs md:text-gray-500 md:truncate md:mt-1 md:flex-1">
          {product.description}
        </p>
        {/* Size and color removed from home card as per request */}

        {/* Price */}
        <div className="flex items-center gap-2 mt-2 md:flex md:items-center md:gap-2 md:mt-2">
          <span className="text-base font-semibold text-rose-700 md:text-base md:font-semibold md:text-rose-700">
            {currency}{product.offerPrice}
          </span>
          <span className="text-xs text-gray-400 line-through md:text-xs md:text-gray-400 md:line-through">
            {currency}{product.price}
          </span>
        </div>

        {/* Add to cart button - Mobile: CategoryProductCard style, Desktop: Original style */}
        <button
          className={`w-full mt-3 px-4 py-2 border rounded-lg transition-colors flex items-center justify-center gap-2 md:w-full md:mt-3 md:px-4 md:py-2 md:border md:rounded-lg md:transition-colors md:flex md:items-center md:justify-center md:gap-2 ${
            isNavigating 
              ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'border-rose-500 bg-white text-rose-500 hover:bg-rose-500 hover:text-white md:border-rose-500 md:bg-white md:text-rose-500 md:hover:bg-rose-500 hover:text-white'
          }`}
          onClick={handleAddToCart}
          disabled={isNavigating}
        >
          {isNavigating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin md:w-4 md:h-4" />
              <span className="text-sm md:text-sm">Loading...</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 md:w-4 md:h-4" />
              <span className="text-sm md:text-sm">Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
