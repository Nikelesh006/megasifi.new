"use client"
import React, { useEffect, useRef, useState } from "react";

import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, useUser, SignOutButton } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { Home, ShoppingBag, Heart, Search, User, LogOut, Box, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const pathname = usePathname();

  const { isSeller, router, user, searchQuery, setSearchQuery, setSubCategoryFilter, clearFilters, getCartCount, cartItems } = useAppContext();
  const { openSignIn } = useClerk()
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const count = getCartCount();
    setCartCount(count);
  }, [cartItems, getCartCount]);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleProfileNavigation = (path) => {
    setIsProfileMenuOpen(false);
    router.push(path);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative">
      <nav className="flex items-center justify-between px-4 md:px-10 lg:px-16 py-2.5 bg-gradient-to-r from-rose-100 to-rose-50 border-b border-rose-200 text-rose-800 shadow-sm">
        <Image
          className="cursor-pointer w-28 md:w-32"
          onClick={() => router.push('/')}
          src={assets.logo_maroon_megasifi}
          alt="logo"
        />

        {/* Mobile Search Bar - full width under logo, reusing SearchBar logic */}
        <div className="w-full md:hidden">
          <SearchBar />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={handleMobileMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-rose-200 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
          <Link href="/" className={`pb-1 transition-colors duration-200 ease-in-out ${
            pathname === '/' 
              ? 'text-rose-600 border-b-2 border-rose-600 font-semibold' 
              : 'hover:text-rose-300 hover:border-b-2 hover:border-rose-300'
          }`}>
            Home
          </Link>
          <Link href="/men" className={`pb-1 transition-colors duration-200 ease-in-out ${
            pathname === '/men' 
              ? 'text-rose-600 border-b-2 border-rose-600 font-semibold' 
              : 'hover:text-rose-300 hover:border-b-2 hover:border-rose-300'
          }`}>
            Men
          </Link>
          <Link href="/women" className={`pb-1 transition-colors duration-200 ease-in-out ${
            pathname === '/women' 
              ? 'text-rose-600 border-b-2 border-rose-600 font-semibold' 
              : 'hover:text-rose-300 hover:border-b-2 hover:border-rose-300'
          }`}>
            Women
          </Link>
          <Link href="/faq" className={`pb-1 transition-colors duration-200 ease-in-out ${
            pathname === '/faq' 
              ? 'text-rose-600 border-b-2 border-rose-600 font-semibold' 
              : 'hover:text-rose-300 hover:border-b-2 hover:border-rose-300'
          }`}>
            FAQ
          </Link>
          <Link href="/contact" className={`pb-1 transition-colors duration-200 ease-in-out ${
            pathname === '/contact' 
              ? 'text-rose-600 border-b-2 border-rose-600 font-semibold' 
              : 'hover:text-rose-300 hover:border-b-2 hover:border-rose-300'
          }`}>
            Contact
          </Link>

          {user && isSeller && (
            <button
              onClick={() => router.push('/seller')}
              className="text-xs border border-white px-4 py-1.5 rounded-full hover:bg-white hover:text-rose-700 transition"
            >
              Admin Dashboard
            </button>
          )}
        </div>

        {/* Search Bar & Action Buttons - Desktop Only */}
        <div className="hidden md:flex items-center gap-5">
          {/* Search Bar */}
          <div className="-ml-4 lg:-ml-6">
            <SearchBar />
          </div>

          {/* Liked Items */}
          <button 
            className="p-2 hover:bg-rose-100 rounded-full transition-colors"
            onClick={() => router.push('/wishlist')}
          >
            <Heart className="w-5 h-5 text-rose-700" />
          </button>

          {/* Cart */}
          <button 
            className="p-2 hover:bg-rose-100 rounded-full transition-colors relative"
            onClick={() => router.push('/cart')}
          >
            <ShoppingBag className="w-5 h-5 text-rose-700" />
            <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
          </button>

          {/* Profile */}
          {user ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                className="p-2 hover:bg-rose-100 rounded-full"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={isProfileMenuOpen}
              >
                <Image
                  src={user.imageUrl}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>

              <div className={`absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 ${isProfileMenuOpen ? 'block' : 'hidden'}`}>
                {/* Profile Header */}
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Image
                      src={user.imageUrl}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{user.firstName || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items Container */}
                <div className="max-h-64 overflow-y-auto">
                  <button
                    onClick={() => handleProfileNavigation('/profile')}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-rose-50 flex items-center gap-3 border-b border-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span className="flex-1">My Profile</span>
                    <span className="text-gray-400">›</span>
                  </button>
                  <button
                    onClick={() => handleProfileNavigation('/my-orders')}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-rose-50 flex items-center gap-3 border-b border-gray-50 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span className="flex-1">My Orders</span>
                    <span className="text-gray-400">›</span>
                  </button>
                </div>

                {/* Sign Out Section */}
                <div className="border-t border-gray-100 bg-gray-50">
                  <SignOutButton>
                    <button className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                      <LogOut className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1">Sign Out</span>
                      <span className="text-gray-400">›</span>
                    </button>
                  </SignOutButton>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={openSignIn} 
              className="flex items-center gap-2 hover:text-rose-700 transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="text-sm">Login</span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu - Positioned directly below navbar */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-rose-200 shadow-xl transition-all duration-300 z-40 ${
        isMobileMenuOpen ? 'max-h-screen opacity-100 visible' : 'max-h-0 opacity-0 invisible overflow-hidden'
      }`}>
        <div className="px-4 py-4">
          <div className="space-y-3">
            <Link href="/" onClick={handleMobileLinkClick} className={`block pb-1 transition-colors duration-200 ease-in-out ${
              pathname === '/' 
                ? 'text-rose-600 border-b-2 border-rose-600 font-semibold' 
                : 'hover:text-rose-300 hover:border-b-2 hover:border-rose-300'
            }`}>
              Home
            </Link>
            <Link href="/men" onClick={handleMobileLinkClick} className={`block pb-1 transition-colors duration-200 ease-in-out ${
              pathname === '/men' 
                ? 'text-rose-600 border-b-2 border-rose-600 font-semibold' 
                : 'hover:text-rose-300 hover:border-b-2 hover:border-rose-300'
            }`}>
              Men
            </Link>
            <Link href="/women" onClick={handleMobileLinkClick} className={`block pb-1 transition-colors duration-200 ease-in-out ${
              pathname === '/women' 
                ? 'text-rose-600 border-b-2 border-rose-600 font-semibold' 
                : 'hover:text-rose-300 hover:border-b-2 hover:border-rose-300'
            }`}>
              Women
            </Link>
            <Link href="/faq" onClick={handleMobileLinkClick} className={`block pb-1 transition-colors duration-200 ease-in-out ${
              pathname === '/faq' 
                ? 'text-rose-600 border-b-2 border-rose-600 font-semibold' 
                : 'hover:text-rose-300 hover:border-b-2 hover:border-rose-300'
            }`}>
              FAQ
            </Link>
            <Link href="/contact" onClick={handleMobileLinkClick} className={`block pb-1 transition-colors duration-200 ease-in-out ${
              pathname === '/contact' 
                ? 'text-rose-600 border-b-2 border-rose-600 font-semibold' 
                : 'hover:text-rose-300 hover:border-b-2 hover:border-rose-300'
            }`}>
              Contact
            </Link>

            {user && isSeller && (
              <button
                onClick={() => {
                  router.push('/seller');
                  handleMobileLinkClick();
                }}
                className="text-xs border border-white px-4 py-1.5 rounded-full hover:bg-white hover:text-rose-700 transition"
              >
                Seller Dashboard
              </button>
            )}

            {/* Mobile Profile Section */}
            {user && (
              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src={user.imageUrl}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Account</p>
                    <p className="text-sm text-gray-600">{user.firstName || 'User'}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      router.push('/profile');
                      handleMobileLinkClick();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                  >
                    <User className="w-4 h-4" /> Profile
                  </button>
                  <button
                    onClick={() => {
                      router.push('/my-orders');
                      handleMobileLinkClick();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> My Orders
                  </button>
                  <SignOutButton>
                    <button
                      onClick={() => {
                        handleMobileLinkClick();
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </SignOutButton>
                </div>
              </div>
            )}

            {/* Mobile Action Buttons - Only show for non-logged users */}
            {!user && (
              <div className="border-t border-gray-200 pt-3">
                <button
                  onClick={() => {
                    router.push('/wishlist');
                    handleMobileLinkClick();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                >
                  <Heart className="w-4 h-4" /> Liked Products
                </button>
                <button
                  onClick={() => {
                    router.push('/cart');
                    handleMobileLinkClick();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Shopping Cart
                  {cartCount > 0 && (
                    <span className="ml-auto bg-rose-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Mobile Action Icons */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
              <button 
                className="p-2 hover:bg-rose-100 rounded-full transition-colors"
                onClick={() => {
                  router.push('/wishlist');
                  handleMobileLinkClick();
                }}
              >
                <Heart className="w-5 h-5 text-rose-700" />
              </button>

              <button 
                className="p-2 hover:bg-rose-100 rounded-full transition-colors relative"
                onClick={() => {
                  router.push('/cart');
                  handleMobileLinkClick();
                }}
              >
                <ShoppingBag className="w-5 h-5 text-rose-700" />
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
              </button>

              {!user && (
                <button 
                  onClick={() => {
                    openSignIn();
                    handleMobileLinkClick();
                  }} 
                  className="flex items-center gap-2 hover:text-rose-700 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;