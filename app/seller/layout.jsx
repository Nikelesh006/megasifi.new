'use client'
import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'
import Footer from '@/components/seller/Footer'
import React from 'react'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex w-full flex-1 relative">
        {/* Sidebar: responsive width + contained within layout */}
        <div className="w-16 md:w-64 fixed md:relative z-10 h-full bg-white">
          <Sidebar />
        </div>

        {/* Main content: flexible, padded, scrollable */}
        <main className="flex-1 md:ml-0 ml-16 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
      {/* Footer at the bottom */}
      <Footer />
    </div>
  )
}

export default Layout