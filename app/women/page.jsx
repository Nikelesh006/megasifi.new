import React from 'react';
import HeaderSlider from '@/components/HeaderSlider';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import Link from 'next/link';

export default function WomenPage() {
  const categories = [
    { name: 'Tops', slug: 'tops', image: assets.tshirt_icon },
    { name: 'Dresses', slug: 'dresses', image: assets.dress_icon },
    { name: 'Jeans', slug: 'jeans', image: assets.jeans_icon },
    { name: 'Skirts', slug: 'skirts', image: assets.skirt_icon },
    { name: 'Jackets', slug: 'jackets', image: assets.jacket_icon },
    { name: 'Activewear', slug: 'activewear', image: assets.activewear_icon },
  ];

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

      {/* Categories */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-rose-800 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.slug} 
              href={`/women/${category.slug}`}
              className="group block text-center p-4 rounded-lg hover:bg-rose-50 transition-colors duration-200"
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
