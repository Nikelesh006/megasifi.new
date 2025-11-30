import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col lg:flex-row items-start justify-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-32 gap-8 py-12 sm:py-14 bg-gradient-to-r from-rose-100 to-rose-50 text-rose-800 border-b border-rose-200 shadow-sm">
        <div className="w-full lg:w-4/5">
          <Image className="w-24 sm:w-28 md:w-32" src={assets.logo_maroon_megasifi} alt="logo" />
          <p className="mt-4 sm:mt-6 text-sm text-gray-700 leading-relaxed">
            Megasifi is your one-stop destination for stylish and quality clothing, curated to inspire confidence and elevate your everyday look. We blend trendsetting designs with comfort, offering a wide selection for every occasion. Discover fashion that suits your personality and experience seamless shopping backed by our commitment to customer satisfaction.
          </p>
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/2 flex items-start justify-start sm:justify-center">
          <div>
            <h2 className="font-medium text-rose mb-4 sm:mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/" className="hover:underline transition">Home</Link>
              </li>
              <li>
                <Link href="/men" className="hover:underline transition">Men</Link>
              </li>
              <li>
                <Link href="/women" className="hover:underline transition">Women</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline transition">Contact Us</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline transition">FAQ</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/2 flex items-start justify-start sm:justify-center">
          <div>
            <h2 className="font-medium text-rose mb-4 sm:mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+91-9043869570</p>
            </div>
            <div className="text-sm space-y-2">
              <p>megasifidrop@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center py-3 sm:py-4 border-t border-rose-100">
        <p className="text-xs md:text-sm text-gray-600">
          Copyright 2025 &copy; Megasifi All Right Reserved.
        </p>
        <p className="text-xs md:text-sm text-gray-600 mt-1">
          Powered by <a href="https://www.codecraftnet.com/" className="text-rose-600 hover:text-rose-700 transition"><b><u>Code Craft</u></b></a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;