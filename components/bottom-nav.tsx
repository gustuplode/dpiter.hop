"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <footer className="fixed bottom-0 w-full bg-white dark:bg-slate-900 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.2)]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-around items-center h-14 md:h-20 relative">
          <Link
            href="/"
            className={`flex flex-col items-center transition-colors ${
              pathname === "/"
                ? "text-[#F97316]"
                : "text-slate-600 dark:text-slate-400 hover:text-[#F97316] dark:hover:text-[#F97316]"
            }`}
          >
            <span
              className="material-symbols-outlined text-lg md:text-4xl"
              style={{ fontVariationSettings: pathname === "/" ? "'FILL' 1" : "'FILL' 0" }}
            >
              home
            </span>
            <span className="text-[9px] md:text-sm font-medium mt-0.5">Home</span>
          </Link>

          <Link
            href="/search"
            className={`flex flex-col items-center transition-colors ${
              pathname === "/search"
                ? "text-[#F97316]"
                : "text-slate-600 dark:text-slate-400 hover:text-[#F97316] dark:hover:text-[#F97316]"
            }`}
          >
            <span className="material-symbols-outlined text-lg md:text-4xl">search</span>
            <span className="text-[9px] md:text-sm font-medium mt-0.5">Search</span>
          </Link>

          <div className="absolute -top-6 md:-top-12">
            <Link href="/">
              <button className="relative bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white rounded-full w-12 h-12 md:w-20 md:h-20 flex items-center justify-center shadow-[0_4px_12px_rgba(249,115,22,0.4)] transform transition-all hover:scale-105 hover:shadow-[0_6px_16px_rgba(249,115,22,0.5)]">
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/20"></div>
                <span className="material-symbols-outlined text-2xl md:text-4xl font-bold relative z-10">
                  shopping_bag
                </span>
              </button>
            </Link>
            <div className="text-center mt-1 md:mt-2">
              <span className="text-[10px] md:text-sm font-bold bg-gradient-to-r from-[#F97316] to-[#EA580C] bg-clip-text text-transparent">
                Dpiter
              </span>
            </div>
          </div>

          <div className="w-10 md:w-20"></div>

          <Link
            href="/wishlist"
            className={`flex flex-col items-center transition-colors ${
              pathname === "/wishlist"
                ? "text-[#F97316]"
                : "text-slate-600 dark:text-slate-400 hover:text-[#F97316] dark:hover:text-[#F97316]"
            }`}
          >
            <span className="material-symbols-outlined text-lg md:text-4xl">favorite_border</span>
            <span className="text-[9px] md:text-sm font-medium mt-0.5">Wishlist</span>
          </Link>

          <Link
            href="/admin/login"
            className={`flex flex-col items-center transition-colors ${
              pathname.startsWith("/admin")
                ? "text-[#F97316]"
                : "text-slate-600 dark:text-slate-400 hover:text-[#F97316] dark:hover:text-[#F97316]"
            }`}
          >
            <span className="material-symbols-outlined text-lg md:text-4xl">person_outline</span>
            <span className="text-[9px] md:text-sm font-medium mt-0.5">Profile</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
