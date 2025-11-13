"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: "home" },
    { href: "/search", label: "Search", icon: "search" },
    { href: "/wishlist", label: "Wishlist", icon: "favorite" },
    { href: "/admin/login", label: "Profile", icon: "person" },
  ]

  return (
    <footer className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto">
      <div className="relative bg-[#F8FAFC]/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 2).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-1/5 ${
                  isActive ? "text-[#F97316]" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <span className={`material-symbols-outlined ${isActive ? "!font-semibold" : ""}`}>{item.icon}</span>
                <span className={`text-xs ${isActive ? "font-semibold" : ""}`}>{item.label}</span>
              </Link>
            )
          })}
          <div className="w-1/5"></div>
          {navItems.slice(2).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith("/admin")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-1/5 ${
                  isActive ? "text-[#F97316]" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <span className={`material-symbols-outlined ${isActive ? "!font-semibold" : ""}`}>{item.icon}</span>
                <span className={`text-xs ${isActive ? "font-semibold" : ""}`}>{item.label}</span>
              </Link>
            )
          })}
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 -top-8 text-center">
          <Link
            href="/"
            className="w-16 h-16 bg-[#F97316] rounded-full flex items-center justify-center shadow-lg ring-4 ring-[#F8FAFC] dark:ring-[#1E293B]"
          >
            <span className="material-symbols-outlined text-white !text-3xl">shopping_bag</span>
          </Link>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 block">Dpiter</span>
        </div>
      </div>
    </footer>
  )
}
