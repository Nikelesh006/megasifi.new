'use client'
import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'
import React from 'react'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex w-full flex-1">
        {/* Sidebar: fixed width + full height */}
        <div className="w-64">
          <Sidebar />
        </div>

        {/* Main content: flexible, padded, scrollable */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout