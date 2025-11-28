import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import { Heart, ShoppingCart, TrendingUp } from 'lucide-react';

const SpecialOffers = () => {
  const { addToCart, router, isLiked, toggleLike } = useAppContext();

  const handleAddToCart = (productId, e) => {
    e.stopPropagation();
    addToCart(productId);
  };

  // Mock data for special offers - 8 products
  const specialOffersProducts = [
    {
      _id: 'special1',
      name: 'Classic White Shirt',
      description: 'Premium cotton shirt for formal wear',
      image: [assets.shirt_img],
      offerPrice: 29.99,
      originalPrice: 49.99,
      category: 'Men'
    },
    {
      _id: 'special2',
      name: 'Summer Floral Dress',
      description: 'Light and comfortable summer dress',
      image: [assets.dress_img],
      offerPrice: 39.99,
      originalPrice: 69.99,
      category: 'Women'
    },
    {
      _id: 'special3',
      name: 'Denim Jeans',
      description: 'Classic fit denim jeans',
      image: [assets.jeans_img],
      offerPrice: 34.99,
      originalPrice: 59.99,
      category: 'Men'
    },
    {
      _id: 'special4',
      name: 'Leather Jacket',
      description: 'Genuine leather motorcycle jacket',
      image: [assets.jacket_img],
      offerPrice: 89.99,
      originalPrice: 149.99,
      category: 'Men'
    },
    {
      _id: 'special5',
      name: 'Silk Blouse',
      description: 'Elegant silk blouse for office wear',
      image: [assets.shirt_img],
      offerPrice: 44.99,
      originalPrice: 79.99,
      category: 'Women'
    },
    {
      _id: 'special6',
      name: 'Cotton T-Shirt',
      description: 'Comfortable everyday t-shirt',
      image: [assets.tshirt_img],
      offerPrice: 19.99,
      originalPrice: 34.99,
      category: 'Men'
    },
    {
      _id: 'special7',
      name: 'Wool Sweater',
      description: 'Warm wool sweater for winter',
      image: [assets.shirt_img],
      offerPrice: 54.99,
      originalPrice: 94.99,
      category: 'Women'
    },
    {
      _id: 'special8',
      name: 'Sports Shorts',
      description: 'Athletic shorts for workouts',
      image: [assets.shorts_img],
      offerPrice: 24.99,
      originalPrice: 39.99,
      category: 'Men'
    }
  ];

  return (
    <div className="flex flex-col items-center pt-14">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-0.5 bg-rose-600"></div>
        <h2 className="text-2xl font-medium text-rose-800">Special Offers</h2>
        <div className="w-8 h-0.5 bg-rose-600"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-6 pb-14 w-full max-w-6xl">
        {specialOffersProducts.map((product) => (
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
              
              {/* Discount badge */}
              <div className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <TrendingUp className="w-3 h-3" />
                -{Math.round(((product.originalPrice - product.offerPrice) / product.originalPrice) * 100)}%
              </div>
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
                <span className="text-xs text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
              </div>
              
              {/* Add to cart button */}
              <button
                className="w-full mt-3 px-4 py-2 border border-rose-500 bg-white text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                onClick={(e) => handleAddToCart(product._id, e)}
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => router.push('/all-products')}
        className="px-8 py-2.5 border border-rose-600 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
      >
        View All Offers
      </button>
    </div>
  );
};

export default SpecialOffers;
