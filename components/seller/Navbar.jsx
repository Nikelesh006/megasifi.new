import React from 'react'
import { assets } from '../../assets/assets'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'

const Navbar = ({ toggleSidebar }) => {
  const { router } = useAppContext()

  return (
    <div className='flex items-center px-4 md:px-8 py-3 justify-between border-b'>
      <div className="flex items-center gap-4">
        {/* Hamburger menu for mobile */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded hover:bg-gray-100"
        >
          <div className="w-6 h-0.5 bg-gray-600 mb-1.5"></div>
          <div className="w-6 h-0.5 bg-gray-600 mb-1.5"></div>
          <div className="w-6 h-0.5 bg-gray-600"></div>
        </button>
        
        <Image 
          onClick={() => router.push('/')} 
          className='w-28 lg:w-32 cursor-pointer' 
          src={assets.logo_maroon_megasifi} 
          alt="Megasifi Logo" 
        />
      </div>
    </div>
  )
}

export default Navbar