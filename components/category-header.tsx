"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoModal } from "./logo-modal"

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
  allProductsCount = 0,
}: CategoryHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const pathname = usePathname()

  const categories = [
    { name: "Fashion", path: "/fashion", icon: "checkroom" },
    { name: "Gadgets", path: "/gadgets", icon: "devices" },
    { name: "Gaming", path: "/gaming", icon: "sports_esports" },
    { name: "Outfit", path: "/outfit", icon: "shopping_bag" },
  ]

  return (
    <>
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((category) => {
          const isActive = pathname === category.path
          return (
            <Link
              key={category.name}
              href={category.path}
              className="flex flex-col items-center justify-center gap-0.5 min-w-[60px] group"
            >
              <div
                className={`flex items-center justify-center size-9 rounded-full transition-all ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark group-hover:bg-primary/10"
                }`}
              >
                <span className="material-symbols-outlined text-base">{category.icon}</span>
              </div>
              <span
                className={`text-[8px] font-medium transition-colors ${
                  isActive
                    ? "text-primary dark:text-primary-light"
                    : "text-text-secondary-light dark:text-text-secondary-dark"
                }`}
              >
                {category.name}
              </span>
            </Link>
          )
        })}
      </div>

      <LogoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
