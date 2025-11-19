"use client"
import React from "react";
import { assets, BagIcon, CartIcon} from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { BoxIcon,HomeIcon } from "lucide-react";


const Navbar = () => {

  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk()

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
        <Link href="/all-products" className="hover:text-rose-300 hover:border-b-2 hover:border-rose-300 pb-1 transition-colors duration-200 ease-in-out">
          Shop
        </Link>
        <Link href="/"  className="hover:text-rose-300 hover:border-b-2 hover:border-rose-300 pb-1 transition-colors duration-200 ease-in-out">
          About Us
        </Link>
        <Link href="/"  className="hover:text-rose-300 hover:border-b-2 hover:border-rose-300 pb-1 transition-colors duration-200 ease-in-out">
          Contact
        </Link>

        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border border-white px-4 py-1.5 rounded-full hover:bg-white hover:text-rose-700 transition">Seller Dashboard</button>}

      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        { 
          user
          ?<>
          <UserButton >
             <UserButton.MenuItems>
              <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={() => router.push('/')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="Products" labelIcon={<BoxIcon/>} onClick={() => router.push('/all-products')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Link href="/cart" label="Cart" labelIcon={<CartIcon />} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push('/my-orders')} />
            </UserButton.MenuItems>

          </UserButton>
          </>
          : <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>}
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border border-white px-4 py-1.5 rounded-full hover:bg-white hover:text-rose-700 transition">Seller Dashboard</button>}
        { 
          user
          ?<>
          <UserButton >
            <UserButton.MenuItems>
              <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={() => router.push('/')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="Products" labelIcon={<BoxIcon/>} onClick={() => router.push('/all-products')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="Cart" labelIcon={<BagIcon />} onClick={() => router.push('/cart')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push('/my-orders')} />
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