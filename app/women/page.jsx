'use client';
import React, { useMemo, useState } from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { useAppContext } from '@/context/AppContext';

export default function WomenPage() {
  const { products } = useAppContext();

  // All women products from context
  const womenProducts = useMemo(
    () => products.filter((product) => product.category === 'Women'),
    [products]
  );

  // Active subcategory filter (tops, dresses, etc.)
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [
    { name: 'Tops', slug: 'tops', subCategory: 'Tops', image: assets.top },
    { name: 'Sarees', slug: 'sarees', subCategory: 'Sarees', image: assets.saree },
    { name: 'Jeans', slug: 'jeans', subCategory: 'Jeans', image: assets.jeans },
    { name: 'Skirts', slug: 'skirts', subCategory: 'Skirts', image: assets.skirt},
    { name: 'Kurti', slug: 'kurti', subCategory: 'Kurti', image: assets.kurti},
    { name: 'Activewear', slug: 'activewear', subCategory: 'Activewear', image: assets.activewear}
  ];

  // Toggle filter: clicking again clears it
  const handleCategoryClick = (subCategory) => {
    setActiveCategory((prev) => (prev === subCategory ? null : subCategory));
  };

  // Apply filter to women products
  const filteredWomenProducts = useMemo(() => {
    if (!activeCategory) return womenProducts;
    return womenProducts.filter(
      (product) =>
        product.subCategory &&
        product.subCategory.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [womenProducts, activeCategory]);

  return (
    <div className="min-h-screen">
      {/* Vibrant Header Section */}
      <div className="relative w-full h-[300px] bg-gradient-to-br from-pink-400 via-rose-400 to-purple-400 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Women's Collection</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">Discover the latest trends in women's fashion with our curated selection of elegant and stylish clothing</p>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
      </div>

      {/* Categories as filters */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h2 className="text-xl md:text-2xl md:text-3xl font-bold text-rose-800 mb-6 md:mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
          {categories.map((category) => {
            const isActive =
              activeCategory &&
              activeCategory.toLowerCase() === category.subCategory.toLowerCase();

            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => handleCategoryClick(category.subCategory)}
                className={`group block text-center p-2 md:p-4 rounded-lg transition-colors duration-200 w-full
                  ${isActive ? 'bg-rose-100 text-rose-900 border-2 border-rose-300 shadow-md' : 'hover:bg-rose-50'}
                `}
              >
                <div
                  className={`bg-white p-2 md:p-4 rounded-full w-20 h-20 md:w-32 md:h-32 flex items-center justify-center mx-auto mb-2 md:mb-3 transition-shadow
                    ${isActive ? 'shadow-md border-2 border-rose-300' : 'group-hover:shadow-md'}
                  `}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={40}
                    height={40}
                    className="object-contain w-8 h-8 md:w-auto md:h-auto"
                  />
                </div>
                <span
                  className={`text-xs md:text-sm font-medium transition-colors
                    ${isActive ? 'text-rose-900' : 'text-rose-800 group-hover:text-rose-600'}
                  `}
                >
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Products list (filtered) */}
      {filteredWomenProducts.length > 0 && (
        <div className="flex flex-col items-center px-4 pb-12">
          <div className="flex items-center justify-between w-full max-w-6xl mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-rose-800">
              Women Products
            </h2>
            {activeCategory && (
              <p className="text-sm text-gray-500">
                Showing: {activeCategory}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-6 pb-14 w-full max-w-6xl">
            {filteredWomenProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {filteredWomenProducts.length === 0 && womenProducts.length > 0 && (
        <div className="flex flex-col items-center px-4 pb-12">
          <p className="text-center text-gray-500">
            No products found for this category.
          </p>
        </div>
      )}
    </div>
  );
}
