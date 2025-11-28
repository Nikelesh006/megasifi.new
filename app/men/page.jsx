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
    { name: 'T-Shirts', slug: 't-shirts', image: assets.tshirt_icon },
    { name: 'Shirts', slug: 'shirts', image: assets.shirt_icon },
    { name: 'Pants', slug: 'pants', image: assets.pants_icon },
    { name: 'Jeans', slug: 'jeans', image: assets.jeans_icon },
    { name: 'Shorts', slug: 'shorts', image: assets.shorts_icon },
    { name: 'Jackets', slug: 'jackets', image: assets.jacket_icon },
  ];

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <Image
          src={assets.men_banner}
          alt="Men's Collection"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="container mx-auto px-4 pb-12 text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-2">Men's Collection</h1>
            <p className="text-lg md:text-xl">Discover the latest trends in men's fashion</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-rose-800 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => {
                setSubCategoryFilter(category.name);
                setSearchQuery('');
              }}
              className={`group block text-center p-4 rounded-lg transition-colors duration-200 ${
                subCategoryFilter === category.name
                  ? 'bg-rose-50 border border-rose-400'
                  : 'hover:bg-rose-50'
              }`}
            >
              <div className="bg-white p-4 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-3 group-hover:shadow-md transition-shadow">
                <Image 
                  src={category.image} 
                  alt={category.name} 
                  width={60} 
                  height={60}
                  className="object-contain"
                />
              </div>
              <span className="font-medium text-rose-800 group-hover:text-rose-600 transition-colors">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
      {menProducts.length > 0 && (
        <div className="container mx-auto px-4 pb-12">
          <div className="flex items-center justify-between mb-4">
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
