import React, { useEffect, useState } from 'react';
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import { Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

const ProductCard = ({ product }) => {
  const { currency, router, addToCart, isLiked, toggleLike } = useAppContext();
  const [liked, setLiked] = useState(false);

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
        {product.originalPrice && product.originalPrice > product.offerPrice && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-md md:hidden">
            <span className="text-xs font-medium">
              -{Math.round(((product.originalPrice - product.offerPrice) / product.originalPrice) * 100)}%
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

        {/* Price */}
        <div className="flex items-center gap-2 mt-2 md:flex md:items-center md:gap-2 md:mt-2">
          <span className="text-base font-semibold text-rose-700 md:text-base md:font-semibold md:text-rose-700">
            {currency}{product.offerPrice}
          </span>
          <span className="text-xs text-gray-400 line-through md:text-xs md:text-gray-400 md:line-through">
            {currency}{product.originalPrice}
          </span>
        </div>

        {/* Add to cart button - Mobile: CategoryProductCard style, Desktop: Original style */}
        <button
          className="w-full mt-3 px-4 py-2 border border-rose-500 bg-white text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-colors flex items-center justify-center gap-2 md:w-full md:mt-3 md:px-4 md:py-2 md:border md:border-rose-500 md:bg-white md:text-rose-500 md:rounded-lg md:hover:bg-rose-500 md:hover:text-white md:transition-colors md:flex md:items-center md:justify-center md:gap-2"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product._id);
          }}
        >
          <ShoppingCart className="w-4 h-4 md:w-4 md:h-4" />
          <span className="text-sm md:text-sm">Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
