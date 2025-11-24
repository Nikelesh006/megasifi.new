import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 bg-gradient-to-r from-rose-100 to-rose-50 text-rose-800 border-b border-rose-200 shadow-sm">
        <div className="w-4/5">
          <Image className="w-28 md:w-32" src={assets.logo_maroon_megasifi} alt="logo" />
          <p className="mt-6 text-sm">
            Megasifi is your one-stop destination for stylish and quality clothing, curated to inspire confidence and elevate your everyday look. We blend trendsetting designs with comfort, offering a wide selection for every occasion. Discover fashion that suits your personality and experience seamless shopping backed by our commitment to customer satisfaction.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-rose mb-5">Company</h2>
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
                <Link href="/faq" className="hover:underline transition">FAQ</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-rose mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+91-6969696969</p>
              <p>Megasifi</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 © Megasifi All Right Reserved.
      </p>
      <p className="pb-4 text-center text-xs md:text-sm">Powered by <a href="https://www.codecraftnet.com/"><b><u>Code Craft</u></b></a></p>
    </footer>
  );
};

export default Footer;