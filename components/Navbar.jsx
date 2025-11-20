"use client"
import React, { useState } from "react";
import { assets, BagIcon, CartIcon} from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { BoxIcon,HomeIcon, Heart, Menu, X } from "lucide-react";


const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk()

  return (
    <nav className="flex items-center justify-between px-4 md:px-10 lg:px-16 py-2.5 bg-gradient-to-r from-rose-100 to-rose-50 border-b border-rose-200 text-rose-800 shadow-sm">
      {/* Logo */}
      <div className="flex items-center">
        <Image
          className="cursor-pointer w-28 md:w-36"
          onClick={() => router.push('/')}
          src={assets.logo_maroon_megasifi}
          alt="logo"
        />
      </div>

      {/* Navigation Links - Hidden on mobile and tablet */}
      <div className="hidden lg:flex items-center gap-6">
        <Link href="/" className="text-rose-800 hover:text-rose-600 hover:underline underline-offset-4 decoration-rose-600 transition-all duration-200">
          Home
        </Link>
        <Link href="/men" className="text-rose-800 hover:text-rose-600 hover:underline underline-offset-4 decoration-rose-600 transition-all duration-200">
          Men
        </Link>
        <Link href="/women" className="text-rose-800 hover:text-rose-600 hover:underline underline-offset-4 decoration-rose-600 transition-all duration-200">
          Women
        </Link>
        <Link href="/faq" className="text-rose-800 hover:text-rose-600 hover:underline underline-offset-4 decoration-rose-600 transition-all duration-200">
          FAQ
        </Link>
        {isSeller && (
          <Link href="/seller" className="text-rose-800 hover:text-rose-600 hover:underline underline-offset-4 decoration-rose-600 transition-all duration-200">
            Admin Dashboard
          </Link>
        )}
      </div>

      {/* Search Bar - Hidden on mobile */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full px-4 py-2 pr-10 border border-rose-300 rounded-full focus:outline-none focus:border-rose-500 bg-white/80 backdrop-blur-sm"
          />
          <Image 
            className="absolute right-3 top-2.5 w-5 h-5 cursor-pointer"
            src={assets.search_icon}
            alt="search"
          />
        </div>
      </div>

      {/* Icons */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Search Icon */}
        <button className="md:hidden p-2 hover:bg-rose-200/50 rounded-full transition">
          <Image src={assets.search_icon} alt="search" className="w-5 h-5" />
        </button>

        {/* Wishlist Icon */}
        <button className="p-2 hover:bg-rose-200/50 rounded-full transition">
          <Heart className="w-5 h-5 md:w-6 md:h-6 text-rose-700" />
        </button>

        {/* Cart Icon */}
        <Link href="/cart" className="p-2 hover:bg-rose-200/50 rounded-full transition">
          <CartIcon />
        </Link>

        {/* Profile */}
        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={() => router.push('/')} />
              <UserButton.Action label="Products" labelIcon={<BoxIcon />} onClick={() => router.push('/all-products')} />
              <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push('/my-orders')} />
              {isSeller && (
                <UserButton.Action label="Seller Dashboard" onClick={() => router.push('/seller')} />
              )}
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button onClick={openSignIn} className="p-2 hover:bg-gray-100 rounded-full transition">
            <Image src={assets.user_icon} alt="user icon" className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        )}

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 hover:bg-rose-200/50 rounded-full transition"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-rose-700" />
          ) : (
            <Menu className="w-6 h-6 text-rose-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-gradient-to-r from-rose-50 to-rose-100 border-b border-rose-200 shadow-lg lg:hidden">
          <div className="flex flex-col p-4 space-y-3">
            <Link 
              href="/" 
              className="text-rose-800 hover:text-rose-600 hover:bg-rose-200/30 py-2 px-3 rounded transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/men" 
              className="text-rose-800 hover:text-rose-600 hover:bg-rose-200/30 py-2 px-3 rounded transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Men
            </Link>
            <Link 
              href="/women" 
              className="text-rose-800 hover:text-rose-600 hover:bg-rose-200/30 py-2 px-3 rounded transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Women
            </Link>
            <Link 
              href="/faq" 
              className="text-rose-800 hover:text-rose-600 hover:bg-rose-200/30 py-2 px-3 rounded transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            {isSeller && (
              <button 
                onClick={() => {
                  router.push('/seller');
                  setIsMobileMenuOpen(false);
                }} 
                className="text-left text-rose-800 hover:text-rose-600 hover:bg-rose-200/30 py-2 px-3 rounded transition"
              >
                Seller Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;