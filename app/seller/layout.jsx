'use client'
import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'
import React, { useState } from 'react'

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex w-full flex-1 relative">
        {/* Sidebar for desktop */}
        <div className="hidden md:block w-64 z-10 top-0 bottom-0 bg-white border-r border-gray-300 overflow-y-auto">
          <Sidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={toggleSidebar}
            />
            {/* Sidebar */}
            <div className="absolute left-0 top-0 h-full w-64 bg-white border-r border-gray-300 overflow-y-auto">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main content: flexible, padded, scrollable */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout