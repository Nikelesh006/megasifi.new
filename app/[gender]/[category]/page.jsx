'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { assets } from '@/assets/assets';
import CategoryProductCard from '@/components/CategoryProductCard';
import Loading from '@/components/Loading';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const { gender, category } = params;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState(null);

  // Mock category data - in real app, this would come from API or CMS
  const getCategoryInfo = (gender, category) => {
    const categoryMap = {
      men: {
        't-shirts': { name: 'T-Shirts', banner: assets.men_banner, description: 'Comfortable and stylish t-shirts for every occasion' },
        'shirts': { name: 'Shirts', banner: assets.men_banner, description: 'Premium shirts for professional and casual wear' },
        'pants': { name: 'Pants', banner: assets.men_banner, description: 'Versatile pants for comfort and style' },
        'jeans': { name: 'Jeans', banner: assets.men_banner, description: 'Denim jeans that fit perfectly' },
        'shorts': { name: 'Shorts', banner: assets.men_banner, description: 'Casual shorts for warm weather' },
        'jackets': { name: 'Jackets', banner: assets.men_banner, description: 'Stylish jackets for all seasons' },
        'earphone': { name: 'Earphones', banner: assets.header_headphone_image, description: 'Premium audio accessories' },
        'watch': { name: 'Watches', banner: assets.venu_watch_image, description: 'Timeless timepieces for modern style' },
      },
      women: {
        't-shirts': { name: 'T-Shirts', banner: assets.women_banner, description: 'Fashionable t-shirts for women' },
        'dresses': { name: 'Dresses', banner: assets.women_banner, description: 'Elegant dresses for every occasion' },
        'pants': { name: 'Pants', banner: assets.women_banner, description: 'Comfortable and stylish pants' },
        'jeans': { name: 'Jeans', banner: assets.women_banner, description: 'Perfect fit jeans for women' },
        'shorts': { name: 'Shorts', banner: assets.women_banner, description: 'Casual shorts for women' },
        'jackets': { name: 'Jackets', banner: assets.women_banner, description: 'Trendy jackets for women' },
        'earphone': { name: 'Earphones', banner: assets.header_headphone_image, description: 'Stylish audio accessories' },
        'watch': { name: 'Watches', banner: assets.venu_watch_image, description: 'Elegant timepieces for women' },
      }
    };

    return categoryMap[gender]?.[category] || null;
  };

  // Mock product data - in real app, this would be fetched from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/products/${gender}/${category}`);
      // const data = await response.json();
      // setProducts(data.products);

      // Mock data for demonstration
      setTimeout(() => {
        const mockProducts = [
          {
            _id: '1',
            name: `${categoryInfo?.name || 'Product'} 1`,
            image: [assets.shirt_img],
            offerPrice: 29.99,
            price: 49.99,
            category: categoryInfo?.name || category
          },
          {
            _id: '2',
            name: `${categoryInfo?.name || 'Product'} 2`,
            image: [assets.shirt_img],
            offerPrice: 39.99,
            price: 69.99,
            category: categoryInfo?.name || category
          },
          {
            _id: '3',
            name: `${categoryInfo?.name || 'Product'} 3`,
            image: [assets.shirt_img],
            offerPrice: 34.99,
            price: 59.99,
            category: categoryInfo?.name || category
          },
          {
            _id: '4',
            name: `${categoryInfo?.name || 'Product'} 4`,
            image: [assets.shirt_img],
            offerPrice: 44.99,
            price: 79.99,
            category: categoryInfo?.name || category
          },
          {
            _id: '5',
            name: `${categoryInfo?.name || 'Product'} 5`,
            image: [assets.shirt_img],
            offerPrice: 24.99,
            price: 39.99,
            category: categoryInfo?.name || category
          },
        ];
        setProducts(mockProducts);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    const info = getCategoryInfo(gender, category);
    setCategoryInfo(info);
    
    if (info) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [gender, category]);

  // Invalid category handling
  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Category Not Found</h1>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
          <Link 
            href={`/${gender}`}
            className="inline-flex items-center gap-2 px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {gender === 'men' ? "Men's" : "Women's"} Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Category Banner */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <Image
          src={categoryInfo.banner}
          alt={`${gender} ${categoryInfo.name} collection`}
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="container mx-auto px-4 pb-12 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Link href={`/${gender}`} className="hover:text-rose-300 transition-colors">
                {gender === 'men' ? "Men's" : "Women's"} Collection
              </Link>
              <span>/</span>
              <span>{categoryInfo.name}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-2">{categoryInfo.name}</h1>
            <p className="text-lg md:text-xl">{categoryInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-rose-800">
            {categoryInfo.name} ({products.length})
          </h2>
          {/* TODO: Add sorting and filtering options here */}
        </div>

        {loading ? (
          <Loading />
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any products in this category. Check back later!
            </p>
            <Link 
              href={`/${gender}`}
              className="inline-flex items-center gap-2 px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse Other Categories
            </Link>
          </div>
        ) : (
          <>
            {/* TODO: Add product filters sidebar here */}
            
            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((product) => (
                <CategoryProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* TODO: Add pagination here */}
            <div className="text-center mt-12">
              <button className="px-8 py-2 border border-rose-600 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors">
                Load More Products
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
