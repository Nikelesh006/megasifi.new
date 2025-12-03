'use client'
import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'
import React from 'react'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex w-full flex-1 relative">
        {/* Sidebar: responsive width + full height */}
        <div className="w-16 md:w-64 fixed md:relative z-10 h-full">
          <Sidebar />
        </div>

        {/* Main content: flexible, padded, scrollable */}
        <main className="flex-1 md:ml-0 ml-16 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout