"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Women = () => {
  const { getToken } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWomenProducts = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get("/api/product/women", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (data.success) {
          setProducts(data.products);
        } else {
          setError(data.message || "Failed to fetch women's products");
        }
      } catch (err) {
        setError("Error fetching women's products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWomenProducts();
  }, [getToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-old-olive">Loading women's collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Link href="/" className="mt-4 inline-block text-rose-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] py-8 md:px-14 px-5 mt-6 rounded-xl">
          <div className="md:pl-8 mt-10 md:mt-0">
            <p className="md:text-base text-rose-700 pb-1">Exclusive Collection</p>
            <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold text-old-olive">
              Women's Premium Collection
            </h1>
            <p className="max-w-lg text-gray-600 mt-4">
              Explore our stunning women's fashion collection. From elegant dresses to casual wear, discover pieces that celebrate your unique style and confidence.
            </p>
            <div className="flex items-center mt-4 md:mt-6">
              <button className="md:px-10 px-7 md:py-2.5 py-2 bg-rose-600 rounded-full text-white font-medium hover:bg-rose-700 transition-colors">
                Shop Now
              </button>
              <button className="group flex items-center gap-2 px-6 py-2.5 font-medium text-old-olive">
                Explore Collection
                <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon} alt="arrow_icon" />
              </button>
            </div>
          </div>
          <div className="flex items-center flex-1 justify-center">
            <Image
              className="md:w-72 w-48"
              src={assets.banner_womens2}
              alt="Women's Collection"
            />
          </div>
        </div>

        {/* Categories Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-16 py-12">
          <h2 className="text-3xl font-bold text-old-olive mb-8">Shop by Category</h2>
          
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(() => {
                // Group products by category
                const categories = {};
                products.forEach(product => {
                  const categoryName = product.category || 'Uncategorized';
                  if (!categories[categoryName]) {
                    categories[categoryName] = [];
                  }
                  categories[categoryName].push(product);
                });

                return Object.entries(categories).map(([categoryName, categoryProducts]) => (
                  <Link 
                    key={categoryName}
                    href={`/women?category=${encodeURIComponent(categoryName)}`}
                    className="group cursor-pointer"
                  >
                    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      {/* Placeholder Image */}
                      <div className="relative h-48 bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-rose-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <span className="text-2xl">👗</span>
                          </div>
                          <p className="text-rose-600 text-sm">Category Image</p>
                        </div>
                      </div>
                      
                      {/* Category Info */}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-old-olive mb-2 capitalize">
                          {categoryName}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {categoryProducts.length} products available
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-rose-600 font-medium">
                            Starting from ₹{Math.min(...categoryProducts.map(p => p.offerPrice || p.price))}
                          </span>
                          <div className="flex items-center text-rose-600 group-hover:text-rose-700 transition-colors">
                            <span className="text-sm font-medium">Shop Now</span>
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ));
              })()}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products available in women's collection.</p>
              <Link 
                href="/"
                className="inline-block bg-rose-600 text-white px-6 py-3 rounded-full hover:bg-rose-700 transition-colors mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Women;
