'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
      count: fashionCount,
    },
    {
      name: 'Gadgets',
      path: '/gadgets',
      icon: '⌚',
      image: '/gadget-device.jpg',
      count: gadgetsCount,
    },
    {
      name: 'Gaming',
      path: '/gaming',
      icon: '🎮',
      image: '/gaming-controller.png',
      count: gamingCount,
    },
    {
      name: 'All Products',
      path: '/all-products',
      icon: '📦',
      image: '/all-products.jpg',
      count: allProductsCount,
    },
  ]

  return (
    <div className="bg-white dark:bg-slate-800 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 mb-4">
      <div className="container mx-auto max-w-7xl px-2">
        <div className="grid grid-cols-5 gap-1 py-2">
          {categories.map((category) => {
            const isActive = pathname === category.path
            return (
              <Link
                key={category.name}
                href={category.path}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 mb-1">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className={`text-[10px] md:text-xs font-medium text-center ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {category.name}
                </span>
                {category.count !== undefined && category.count > 0 && (
                  <span className="text-[9px] text-slate-500 dark:text-slate-400">
                    ({category.count})
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
