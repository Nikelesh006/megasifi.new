"use client";

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function RootLayoutWithNav({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
