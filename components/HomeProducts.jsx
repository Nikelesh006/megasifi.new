import React from 'react';
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import { Heart, ShoppingCart, TrendingUp } from 'lucide-react';

const HomeProducts = () => {
  const { addToCart, router, toggleLike, isLiked } = useAppContext();

  // Mock data for popular products - 8 products
  const popularProducts = [
    {
      _id: 'popular1',
      name: 'Traditional Saree',
      description: 'Elegant traditional silk saree',
      image: [assets.saree_linen_image],
      offerPrice: 89.99,
      originalPrice: 129.99,
      category: 'Women',
    },
    {
      _id: 'popular2',
      name: 'Classic Cotton Shirt',
      description: 'Comfortable cotton shirt for daily wear',
      image: [assets.shirt_img],
      offerPrice: 34.99,
      originalPrice: 54.99,
      category: 'Men',
    },
    {
      _id: 'popular3',
      name: 'Designer Blouse',
      description: 'Stylish designer blouse',
      image: [assets.saree_grey_image],
      offerPrice: 44.99,
      originalPrice: 69.99,
      category: 'Women',
    },
    {
      _id: 'popular4',
      name: 'Formal Trousers',
      description: 'Professional formal trousers',
      image: [assets.pants_img],
      offerPrice: 49.99,
      originalPrice: 79.99,
      category: 'Men',
    },
    {
      _id: 'popular5',
      name: 'Party Wear Saree',
      description: 'Beautiful party wear saree',
      image: [assets.saree_new2_image],
      offerPrice: 119.99,
      originalPrice: 189.99,
      category: 'Women',
    },
    {
      _id: 'popular6',
      name: 'Casual T-Shirt',
      description: 'Comfortable casual t-shirt',
      image: [assets.tshirt_img],
      offerPrice: 24.99,
      originalPrice: 39.99,
      category: 'Men',
    },
    {
      _id: 'popular7',
      name: 'Embroidered Kurti',
      description: 'Traditional embroidered kurti',
      image: [assets.saree_linen_image],
      offerPrice: 54.99,
      originalPrice: 84.99,
      category: 'Women',
    },
    {
      _id: 'popular8',
      name: 'Denim Jeans',
      description: 'Classic fit denim jeans',
      image: [assets.jeans_img],
      offerPrice: 59.99,
      originalPrice: 89.99,
      category: 'Men',
    },
  ];

  return (
    <div className="flex flex-col items-center pt-14">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-rose-600" />
        <h2 className="text-2xl font-medium text-rose-800">Popular Products</h2>
        <TrendingUp className="w-6 h-6 text-rose-600" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-6 pb-14 w-full max-w-6xl">
        {popularProducts.map((product) => (
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
                <span className="text-xs text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
              </div>

              {/* Add to cart button */}
              <button
                className="w-full mt-3 px-4 py-2 border border-rose-500 bg-white text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product._id);
                }}
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
        <TrendingUp className="w-4 h-4" />
        See More Products
      </button>
    </div>
  );
};

export default HomeProducts;
