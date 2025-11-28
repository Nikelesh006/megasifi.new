"use client"
import React, { useEffect, useRef, useState } from "react";

import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, useUser, SignOutButton } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { Home, ShoppingBag, Heart, Search, User, LogOut, Box } from "lucide-react";

const Navbar = () => {

  const { isSeller, router, user, searchQuery, setSearchQuery, setSubCategoryFilter, clearFilters } = useAppContext();
  const { openSignIn } = useClerk()

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

  return (
    <nav className="flex items-center justify-between px-4 md:px-10 lg:px-16 py-2.5 bg-gradient-to-r from-rose-100 to-rose-50 border-b border-rose-200 text-rose-800 shadow-sm">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push('/')}
        src={assets.logo_maroon_megasifi}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-rose-300 hover:border-b-2 hover:border-rose-300 pb-1 transition-colors duration-200 ease-in-out">
          Home
        </Link>
        <Link href="/men" className="hover:text-rose-300 hover:border-b-2 hover:border-rose-300 pb-1 transition-colors duration-200 ease-in-out">
          Men
        </Link>
        <Link href="/women" className="hover:text-rose-300 hover:border-b-2 hover:border-rose-300 pb-1 transition-colors duration-200 ease-in-out">
          Women
        </Link>
        <Link href="/faq" className="hover:text-rose-300 hover:border-b-2 hover:border-rose-300 pb-1 transition-colors duration-200 ease-in-out">
          FAQ
        </Link>

        {user && isSeller && (
          <button
            onClick={() => router.push('/seller')}
            className="text-xs border border-white px-4 py-1.5 rounded-full hover:bg-white hover:text-rose-700 transition"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      <div className="hidden md:flex items-center gap-5">
        {/* Search Bar */}
        <div className="relative -ml-4 lg:-ml-6">
          <input
            type="text"
            placeholder="Search by name, category, or list item..."
            className="w-60 lg:w-72 xl:w-80 px-4 py-1.5 pr-10 rounded-full border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm"
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);
              if (value) {
                setSubCategoryFilter('All');
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const value = e.currentTarget.value;
                setSearchQuery(value);
                if (value) {
                  setSubCategoryFilter('All');
                }
              }
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              const value = searchQuery || '';
              setSearchQuery(value);
              if (value) {
                setSubCategoryFilter('All');
              }
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 transform"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-gray-400" />
          </button>
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
          <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
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

            <div className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ${isProfileMenuOpen ? 'block' : 'hidden'}`}>
              <button
                onClick={() => handleProfileNavigation('/profile')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 flex items-center gap-2"
              >
                <User className="w-4 h-4" /> Profile
              </button>
              <button
                onClick={() => handleProfileNavigation('/my-orders')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> My Orders
              </button>
              <SignOutButton>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 flex items-center gap-2"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </SignOutButton>
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

      <div className="flex items-center md:hidden gap-3">
        {user && isSeller && (
          <button
            onClick={() => router.push('/seller')}
            className="text-xs border border-white px-4 py-1.5 rounded-full hover:bg-white hover:text-rose-700 transition"
          >
            Seller Dashboard
          </button>
        )}
        
        { 
          user
          ?<>
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="Home" labelIcon={<Home className="w-4 h-4" />} onClick={() => router.push('/')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="Products" labelIcon={<Box className="w-4 h-4" />} onClick={() => router.push('/all-products')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="Cart" labelIcon={<ShoppingBag className="w-4 h-4" />} onClick={() => router.push('/cart')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="My Orders" labelIcon={<ShoppingBag className="w-4 h-4" />} onClick={() => router.push('/my-orders')} />
            </UserButton.MenuItems>
          </UserButton>
          </>
          : <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>
        }
      </div>
    </nav>
  );
};

export default Navbar;