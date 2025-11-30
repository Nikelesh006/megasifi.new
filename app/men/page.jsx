'use client'
import React from 'react';
import HeaderSlider from '@/components/HeaderSlider';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useAppContext } from '@/context/AppContext';

export default function MenPage() {
  const { products, searchQuery, setSearchQuery, subCategoryFilter, setSubCategoryFilter, clearFilters } = useAppContext();
  const menProducts = products.filter((product) => product.category === 'Men');

  const filteredMenProducts = menProducts.filter((product) => {
    const activeSub = (subCategoryFilter || 'All');
    const matchesSubCategory =
      activeSub === 'All'
        ? true
        : (product.subCategory || '').toLowerCase() === activeSub.toLowerCase();

    const query = (searchQuery || '').trim().toLowerCase();
    if (!query) {
      return matchesSubCategory;
    }

    const name = (product.name || '').toLowerCase();
    const category = (product.category || '').toLowerCase();
    const sub = (product.subCategory || '').toLowerCase();
    const description = (product.description || '').toLowerCase();
    const offerPriceStr =
      typeof product.offerPrice === 'number' ? String(product.offerPrice) : '';
    const originalPriceStr =
      typeof product.price === 'number' ? String(product.price) : '';
    const matchesSearch =
      name.includes(query) ||
      category.includes(query) ||
      sub.includes(query) ||
      description.includes(query) ||
      offerPriceStr.includes(query) ||
      originalPriceStr.includes(query);

    return matchesSubCategory && matchesSearch;
  });

  const categories = [
    { name: 'T-Shirts', slug: 't-shirts', image: assets.tshirt },
    { name: 'Shirts', slug: 'shirts', image: assets.cloth },
    { name: 'Pants', slug: 'pants', image: assets.pants },
    { name: 'Jeans', slug: 'jeans', image: assets.jeans },
    { name: 'Shorts', slug: 'shorts', image: assets.shorts },
    { name: 'Jackets', slug: 'jackets', image: assets.jacket },
  ];

  return (
    <div className="min-h-screen">
      {/* Vibrant Header Section */}
      <div className="relative w-full h-[300px] bg-gradient-to-br from-rose-400 via-purple-400 to-blue-400 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Men's Collection</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">Discover the latest trends in men's fashion with our curated selection of premium clothing</p>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h2 className="text-xl md:text-2xl md:text-3xl font-bold text-rose-800 mb-6 md:mb-8">Shop by Category</h2>
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => {
                setSubCategoryFilter(category.name);
                setSearchQuery('');
              }}
              className={`group block text-center p-2 md:p-4 rounded-lg transition-colors duration-200 ${
                subCategoryFilter === category.name
                  ? 'bg-rose-100 text-rose-900 border-2 border-rose-300 shadow-md'
                  : 'hover:bg-rose-50'
              }`}
            >
              <div className={`bg-white p-2 md:p-4 rounded-full w-20 h-20 md:w-32 md:h-32 flex items-center justify-center mx-auto mb-2 md:mb-3 transition-shadow ${
                subCategoryFilter === category.name ? 'shadow-md border-2 border-rose-300' : 'group-hover:shadow-md'
              }`}>
                <Image 
                  src={category.image} 
                  alt={category.name} 
                  width={40} 
                  height={40}
                  className="object-contain w-8 h-8 md:w-auto md:h-auto"
                />
              </div>
              <span className={`text-xs md:text-sm font-medium transition-colors ${
                subCategoryFilter === category.name ? 'text-rose-900' : 'text-rose-800 group-hover:text-rose-600'
              }`}>
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
      {menProducts.length > 0 && (
        <div className="flex flex-col items-center px-4 pb-12">
          <div className="flex items-center justify-between w-full max-w-6xl mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-rose-800">Men Products</h2>
            {(searchQuery || subCategoryFilter !== 'All') && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-rose-600 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {filteredMenProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p>
                {searchQuery || subCategoryFilter !== 'All'
                  ? 'No products match your search criteria.'
                  : "No products available right now."}
              </p>
              {(searchQuery || subCategoryFilter !== 'All') && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-2 text-rose-600 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-6 pb-14 w-full max-w-6xl">
              {filteredMenProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
