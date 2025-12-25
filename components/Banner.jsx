import React from "react";
import Link from "next/link";

const Banner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 bg-[#E6E9F2] my-16 rounded-xl overflow-hidden text-center px-6">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
        Help us improve Megasifi
      </h2>
      <p className="mt-2 max-w-2xl text-sm md:text-base font-medium text-gray-800/70">
        Feel free to contact us if you have any suggestions for the site's improvements, new features you would like to see, or if you face any errors while using the site.
      </p>
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=codecraft2k@gmail.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center px-8 py-2.5 bg-rose-600 hover:bg-rose-700 transition rounded text-white w-full sm:w-auto"
        >
          Contact us
        </a>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-8 py-2.5 border border-rose-600 text-rose-600 hover:bg-rose-50 transition rounded w-full sm:w-auto"
        >
          Contact page
        </Link>
      </div>
    </div>
  );
};

export default Banner;