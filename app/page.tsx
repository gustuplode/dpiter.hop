import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { getProductUrl } from "@/lib/utils"
import { Suspense } from "react"
import { CollectionGridSkeleton } from "@/components/collection-skeleton"
import { CurrencyDisplay } from "@/components/currency-display"
import { BannerCarousel } from "@/components/banner-carousel"

async function ProductList() {
  const supabase = await createClient()

  let products: any[] = []
  let error = null

  try {
    const { data, error: fetchError } = await supabase
      .from("category_products")
      .select("*")
      .eq("is_visible", true)
      .order("created_at", { ascending: false })
      .limit(20)

    if (fetchError) {
      error = fetchError
    } else {
      products = data || []
    }
  } catch (e) {
    error = e
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <p className="text-lg text-slate-600 dark:text-slate-400">Unable to load products</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:gap-4 xl:grid-cols-5">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex flex-col bg-white dark:bg-gray-800 overflow-hidden border-t border-r border-black/10 dark:border-white/10 md:rounded-lg md:border hover:shadow-lg transition-shadow"
        >
          <Link
            href={getProductUrl(product.id, product.title, product.category)}
            className="block flex-1 flex flex-col"
          >
            <div
              className="relative w-full bg-center bg-no-repeat aspect-square bg-cover"
              style={{ backgroundImage: `url("${product.image_url || "/placeholder.svg"}")` }}
            >
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 text-white rounded-full px-2 py-1 text-xs backdrop-blur-sm">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="font-semibold">4.1</span>
              </div>
            </div>

            <div className="p-3 flex flex-col gap-2 flex-1 bg-[#F7F7F7] dark:bg-gray-800">
              <p className="text-[10px] font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark tracking-wide">
                {product.brand || "Brand"}
              </p>
              <p className="text-text-primary-light dark:text-text-primary-dark text-[11px] font-semibold leading-snug line-clamp-2">
                {product.title}
              </p>

              <div className="flex items-center gap-2 mt-1">
                <p className="text-text-primary-light dark:text-white text-sm font-bold">
                  <CurrencyDisplay price={product.price} />
                </p>
                {product.original_price && (
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-normal line-through">
                    <CurrencyDisplay price={product.original_price} />
                  </p>
                )}
              </div>

              <div className="mt-auto pt-2 flex flex-col gap-2">
                <div className="border-t border-black/10 dark:border-white/10 opacity-50"></div>
                <div className="flex items-center justify-end text-text-secondary-light dark:text-text-secondary-dark -mt-1">
                  <div className="flex items-center gap-1">
                    <WishlistButton
                      productId={product.id}
                      className="flex items-center justify-center h-8 w-8 text-text-primary-light dark:text-text-primary-dark hover:text-primary transition-colors"
                    />
                    <RatingButton
                      itemId={product.id}
                      itemType="product"
                      className="flex items-center justify-center h-8 w-8 text-text-primary-light dark:text-text-primary-dark hover:text-primary transition-colors"
                    />
                    <AddToCartButton
                      productId={product.id}
                      className="flex items-center justify-center h-8 w-8 text-primary dark:text-primary-light hover:text-primary/80 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-background-light dark:bg-background-dark">
      <BannerCarousel />

      <div className="flex flex-col">
        <div className="px-4 mb-3">
          <h2 className="font-display text-lg font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight">
            All Products
          </h2>
        </div>
        <main className="pb-20">
          <Suspense fallback={<CollectionGridSkeleton />}>
            <ProductList />
          </Suspense>
        </main>
      </div>

      <FooterLinks />
      <BottomNav />
    </div>
  )
}
