'use client'

import { Search, ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { UserAvatar } from './user-avatar'
import { createClient } from '@/lib/supabase/client'

export function SearchHeader() {
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const searchProducts = async () => {
      if (!searchQuery.trim()) {
        setProducts([])
        return
      }

      setIsLoading(true)
      const supabase = createClient()
      const query = searchQuery.toLowerCase().trim()

      const { data } = await supabase
        .from("products")
        .select("*")
        .or(`title.ilike.%${query}%,brand.ilike.%${query}%,price.eq.${Number.parseFloat(query) || -1}`)
        .eq("is_visible", true)
        .order("created_at", { ascending: false })
        .limit(20)

      setProducts(data || [])
      setIsLoading(false)
    }

    const debounce = setTimeout(() => {
      searchProducts()
    }, 300)

    return () => clearTimeout(debounce)
  }, [searchQuery])

  return (
    <>
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            {!isHome && (
              <button 
                onClick={() => router.back()}
                className="p-1 -ml-1 text-muted-foreground hover:bg-accent rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white">
              <span className="font-display font-bold text-2xl">D</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Dpiter</h1>
          </div>
          <UserAvatar size="sm" asButton />
        </div>
        <div className="px-4 pb-4">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-muted-foreground flex items-center justify-center pl-4">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden text-foreground focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-muted-foreground px-2 text-base font-normal leading-normal"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
              />
              <div className="flex items-center pr-2 gap-1">
                <button className="flex items-center justify-center rounded-md h-9 w-9 bg-transparent text-muted-foreground">
                  <span className="material-symbols-outlined text-2xl">mic</span>
                </button>
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
                <button className="flex items-center justify-center rounded-md h-9 w-9 bg-transparent text-muted-foreground">
                  <span className="material-symbols-outlined text-2xl">photo_camera</span>
                </button>
              </div>
            </div>
          </label>
        </div>
      </header>

      {showResults && searchQuery && (
        <div className="fixed top-[140px] left-0 right-0 z-20 bg-white dark:bg-slate-800 border-b border-border shadow-lg max-h-[60vh] overflow-y-auto">
          <div className="container mx-auto max-w-7xl">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-sm">
                No products found
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 p-2">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.category}/${product.id}/${product.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex flex-col bg-white dark:bg-slate-700 rounded-md overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative w-full aspect-square bg-slate-200 dark:bg-slate-600">
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {product.brand}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {product.title}
                      </p>
                      <p className="text-sm font-bold text-foreground mt-1">
                        ₹{product.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
