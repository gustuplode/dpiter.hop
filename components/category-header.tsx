'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LogoModal } from './logo-modal'

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
      name: 'Gadget',
      path: '/gadgets',
      icon: 'phone_iphone',
    },
    {
      name: 'Fashion',
      path: '/fashion',
      icon: 'styler',
    },
    {
      name: 'Gaming',
      path: '/gaming',
      icon: 'sports_esports',
    },
    {
      name: 'Outfit',
      path: '/',
      icon: 'apparel',
    },
  ]

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-6 px-4">
        {categories.map((category) => {
          const isActive = pathname === category.path
          return (
            <Link
              key={category.name}
              href={category.path}
              className="flex flex-col items-center justify-start gap-1 text-center"
            >
              <div className="bg-secondary dark:bg-primary/20 flex items-center justify-center text-primary aspect-square rounded-full size-14">
                <span className="material-symbols-outlined text-2xl">
                  {category.icon}
                </span>
              </div>
              <p className="text-xs font-semibold leading-tight text-foreground">
                {category.name}
              </p>
            </Link>
          )
        })}
      </div>

      <LogoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
