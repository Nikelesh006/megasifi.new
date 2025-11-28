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
    { name: 'Tops', slug: 'tops', subCategory: 'Tops', image: assets.tshirt_icon },
    { name: 'Dresses', slug: 'dresses', subCategory: 'Dresses', image: assets.dress_icon },
    { name: 'Jeans', slug: 'jeans', subCategory: 'Jeans', image: assets.jeans_icon },
    { name: 'Skirts', slug: 'skirts', subCategory: 'Skirts', image: assets.skirt_icon },
    { name: 'Jackets', slug: 'jackets', subCategory: 'Jackets', image: assets.jacket_icon },
    { name: 'Activewear', slug: 'activewear', subCategory: 'Activewear', image: assets.activewear_icon },
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
      {/* Banner */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <Image
          src={assets.women_banner}
          alt="Women's Collection"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="container mx-auto px-4 pb-12 text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-2">Women's Collection</h1>
            <p className="text-lg md:text-xl">Discover the latest trends in women's fashion</p>
          </div>
        </div>
      </div>

      {/* Categories as filters */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-rose-800 mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => {
            const isActive =
              activeCategory &&
              activeCategory.toLowerCase() === category.subCategory.toLowerCase();

            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => handleCategoryClick(category.subCategory)}
                className={`group block text-center p-4 rounded-lg transition-colors duration-200 w-full
                  ${isActive ? 'bg-rose-600 text-white' : 'hover:bg-rose-50'}
                `}
              >
                <div
                  className={`bg-white p-4 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-3 transition-shadow
                    ${isActive ? 'shadow-md shadow-rose-300' : 'group-hover:shadow-md'}
                  `}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
                <span
                  className={`font-medium transition-colors
                    ${isActive ? 'text-white' : 'text-rose-800 group-hover:text-rose-600'}
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
        <div className="container mx-auto px-4 pb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-rose-800">
              Women Products
            </h2>
            {activeCategory && (
              <p className="text-sm text-gray-500">
                Showing: {activeCategory}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredWomenProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {filteredWomenProducts.length === 0 && womenProducts.length > 0 && (
        <div className="container mx-auto px-4 pb-12">
          <p className="text-center text-gray-500">
            No products found for this category.
          </p>
        </div>
      )}
    </div>
  );
}
