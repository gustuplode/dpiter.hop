"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export function BottomNav() {
  const pathname = usePathname()
  const [wishlistFlash, setWishlistFlash] = useState(false)

  useEffect(() => {
    const handleWishlistAdded = () => {
      setWishlistFlash(true)
      setTimeout(() => setWishlistFlash(false), 1000)
    }
    
    window.addEventListener('wishlistAdded', handleWishlistAdded)
    return () => window.removeEventListener('wishlistAdded', handleWishlistAdded)
  }, [])

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border flex justify-around items-center z-20 shadow-[0_-2px_5px_rgba(0,0,0,0.05)]">
      <Link 
        href="/" 
        className={`flex flex-col items-center justify-center gap-1 ${pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}
      >
        <span className="material-symbols-outlined">home</span>
        <span className="text-xs font-bold">Home</span>
      </Link>
      <Link 
        href="/cart" 
        className={`flex flex-col items-center justify-center gap-1 ${pathname === '/cart' ? 'text-primary' : 'text-muted-foreground'}`}
      >
        <span className="material-symbols-outlined">shopping_cart</span>
        <span className="text-xs font-medium">Cart</span>
      </Link>
      <Link 
        href="/offers" 
        className={`flex flex-col items-center justify-center gap-1 ${pathname === '/offers' ? 'text-primary' : 'text-muted-foreground'}`}
      >
        <span className="material-symbols-outlined">sell</span>
        <span className="text-xs font-medium">Offers</span>
      </Link>
      <Link 
        href="/profile" 
        className={`flex flex-col items-center justify-center gap-1 ${pathname === '/profile' ? 'text-primary' : 'text-muted-foreground'}`}
      >
        <span className="material-symbols-outlined">account_circle</span>
        <span className="text-xs font-medium">Account</span>
      </Link>
    </nav>
  )
}
