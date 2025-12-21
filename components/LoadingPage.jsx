'use client';
import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';

const LoadingPage = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Ensure minimum 3 seconds have passed
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, 3000 - elapsedTime);
          
          setTimeout(() => {
            onLoadingComplete();
          }, remainingTime);
          
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => {
      clearInterval(interval);
    };
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-rose-50 to-white z-50 flex flex-col items-center justify-center">
      {/* Shopping Cart Animation Container */}
      <div className="relative w-80 h-20 mb-8">
        {/* Track Line */}
        <div className="absolute bottom-8 left-0 right-0 h-0.5 bg-rose-200 rounded-full"></div>
        
        {/* Moving Shopping Cart */}
        <div
          className="absolute bottom-4 transition-all duration-300 ease-linear"
          style={{
            left: `${progress}%`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="relative">
            {/* Cart with wheels animation */}
            <ShoppingCart 
              className="w-12 h-12 text-rose-500" 
            />
          </div>
        </div>

        {/* Start and End markers */}
        <div className="absolute bottom-2 left-0 text-xs text-rose-300">START</div>
        <div className="absolute bottom-2 right-0 text-xs text-rose-300">CHECKOUT</div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-rose-600 animate-pulse">
          Megasifi
        </h1>
        <p className="text-gray-600 text-sm">
          Preparing your shopping experience
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-64 mt-8">
        <div className="h-2 bg-rose-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-center text-xs text-rose-500 mt-2">
          {progress}% Complete
        </p>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 w-8 h-8 bg-rose-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-20 right-20 w-6 h-6 bg-rose-300 rounded-full opacity-30 animate-pulse delay-75"></div>
      <div className="absolute bottom-20 left-20 w-10 h-10 bg-rose-200 rounded-full opacity-20 animate-pulse delay-150"></div>
      <div className="absolute bottom-10 right-10 w-4 h-4 bg-rose-300 rounded-full opacity-40 animate-pulse delay-300"></div>

      <style jsx>{`
        .delay-75 {
          animation-delay: 75ms;
        }
        
        .delay-150 {
          animation-delay: 150ms;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }

        .duration-3000 {
          transition-duration: 3000ms;
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;
