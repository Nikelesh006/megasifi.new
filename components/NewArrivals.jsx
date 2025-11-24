import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import { Heart, ShoppingCart, Sparkles } from 'lucide-react';
import { addToWishlist, removeFromWishlist, isLiked } from '@/lib/wishlistManager';

const NewArrivals = () => {
  const { addToCart, router } = useAppContext();
  const [likedItems, setLikedItems] = useState(new Set());

  // Sync liked items with wishlist manager
  useEffect(() => {
    const updateLikedItems = () => {
      const newLikedItems = new Set();
      newArrivalsProducts.forEach(product => {
        if (isLiked(product._id)) {
          newLikedItems.add(product._id);
        }
      });
      setLikedItems(newLikedItems);
    };

    updateLikedItems();
  }, []);

  const toggleLike = (productId, e) => {
    e.stopPropagation();
    
    if (isLiked(productId)) {
      removeFromWishlist(productId);
      setLikedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    } else {
      addToWishlist(productId);
      setLikedItems(prev => {
        const newSet = new Set(prev);
        newSet.add(productId);
        return newSet;
      });
    }
  };

  // Mock data for new arrivals - 8 products
  const newArrivalsProducts = [
    {
      _id: 'new1',
      name: 'Modern Polo Shirt',
      description: 'Stylish polo shirt with modern fit',
      image: [assets.shirt_img],
      offerPrice: 42.99,
      originalPrice: 59.99,
      category: 'Men'
    },
    {
      _id: 'new2',
      name: 'Elegant Evening Gown',
      description: 'Beautiful gown for special occasions',
      image: [assets.dress_img],
      offerPrice: 129.99,
      originalPrice: 189.99,
      category: 'Women'
    },
    {
      _id: 'new3',
      name: 'Casual Chinos',
      description: 'Comfortable chinos for everyday wear',
      image: [assets.pants_img],
      offerPrice: 49.99,
      originalPrice: 74.99,
      category: 'Men'
    },
    {
      _id: 'new4',
      name: 'Trendy Bomber Jacket',
      description: 'Fashionable bomber jacket',
      image: [assets.jacket_img],
      offerPrice: 79.99,
      originalPrice: 119.99,
      category: 'Men'
    },
    {
      _id: 'new5',
      name: 'Floral Summer Top',
      description: 'Light and airy summer top',
      image: [assets.shirt_img],
      offerPrice: 34.99,
      originalPrice: 54.99,
      category: 'Women'
    },
    {
      _id: 'new6',
      name: 'Athletic Leggings',
      description: 'Comfortable leggings for workouts',
      image: [assets.pants_img],
      offerPrice: 29.99,
      originalPrice: 44.99,
      category: 'Women'
    },
    {
      _id: 'new7',
      name: 'Smart Casual Blazer',
      description: 'Versatile blazer for work and leisure',
      image: [assets.jacket_img],
      offerPrice: 99.99,
      originalPrice: 149.99,
      category: 'Men'
    },
    {
      _id: 'new8',
      name: 'Bohemian Maxi Dress',
      description: 'Free-spirited bohemian style dress',
      image: [assets.dress_img],
      offerPrice: 69.99,
      originalPrice: 99.99,
      category: 'Women'
    }
  ];

  const handleAddToCart = (productId, e) => {
    e.stopPropagation();
    addToCart(productId);
  };

  return (
    <div className="flex flex-col items-center pt-14">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-rose-600" />
        <h2 className="text-2xl font-medium text-rose-800">New Arrivals</h2>
        <Sparkles className="w-6 h-6 text-rose-600" />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pb-14 w-full max-w-6xl">
        {newArrivalsProducts.map((product) => (
          <div
            key={product._id}
            className="flex flex-col items-start gap-2 cursor-pointer group transition-all duration-300 bg-white rounded-lg shadow-sm hover:shadow-lg hover:shadow-rose-100 border border-gray-100 hover:border-rose-200 transform hover:-translate-y-1"
            onClick={() => router.push('/product/' + product._id)}
          >
            {/* Image container */}
            <div className="relative w-full h-48 flex items-center justify-center overflow-hidden rounded-t-lg bg-gradient-to-br from-rose-50 to-white">
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
                    likedItems.has(product._id) 
                      ? 'text-rose-600 fill-current' 
                      : 'text-gray-400 hover:text-rose-600'
                  }`}
                />
              </button>
              
              {/* New badge */}
              <div className="absolute top-2 left-2 bg-gradient-to-r from-rose-600 to-rose-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3" />
                NEW
              </div>
            </div>

            {/* Product info */}
            <div className="w-full p-3 flex-1 flex flex-col">
              <h3 className="text-sm font-medium text-gray-800 truncate group-hover:text-rose-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 truncate mt-1 flex-1">
                {product.description}
              </p>
              
              {/* Price */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-base font-semibold text-rose-600">
                  ${product.offerPrice}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
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
        ))}
      </div>
      
      <button 
        onClick={() => router.push('/all-products')}
        className="px-8 py-2.5 border border-rose-600 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Explore New Arrivals
      </button>
    </div>
  );
};

export default NewArrivals;
