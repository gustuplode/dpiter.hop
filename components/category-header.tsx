'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LogoModal } from './logo-modal'
import { UserAvatar } from './user-avatar'

interface CategoryHeaderProps {
  fashionCount?: number
  gadgetsCount?: number
  gamingCount?: number
  allProductsCount?: number
}

export function CategoryHeader({ 
  fashionCount = 0, 
  gadgetsCount = 0, 
  gamingCount = 0,
  allProductsCount = 0 
}: CategoryHeaderProps) {
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const categories = [
    {
      name: 'Outfit',
      path: '/',
      icon: '👔',
      image: '/stylish-streetwear-outfit.png',
    },
    {
      name: 'Fashion',
      path: '/fashion',
      icon: '👕',
      image: '/shirt-fashion.jpg',
    },
    {
      name: 'Gadgets',
      path: '/gadgets',
      icon: '⌚',
      image: '/gadget-device.jpg',
    },
    {
      name: 'Gaming',
      path: '/gaming',
      icon: '🎮',
      image: '/gaming-controller.png',
    },
    {
      name: 'All Products',
      path: '/all-products',
      icon: '📦',
      image: '/all-products.jpg',
    },
  ]

  return (
    <>
      <div className="bg-white dark:bg-slate-800 sticky top-0 z-20 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="container mx-auto max-w-7xl px-2 py-1">
          <div className="flex items-center justify-evenly gap-1">
            {categories.map((category) => {
              const isActive = pathname === category.path
              return (
                <Link
                  key={category.name}
                  href={category.path}
                  className={`flex flex-col items-center transition-all duration-300 ${
                    isActive
                      ? 'scale-105'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className={`relative w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 mb-0.5 transition-all duration-300 ${
                    isActive 
                      ? 'ring-2 ring-blue-500 ring-offset-1 shadow-lg' 
                      : 'shadow-md hover:shadow-lg'
                  }`}>
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                    {isActive && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                    )}
                  </div>
                  <span className={`text-[9px] md:text-[10px] font-medium text-center leading-tight transition-colors ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {category.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <LogoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
