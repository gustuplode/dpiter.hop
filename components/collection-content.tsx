"use client"

import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"
import { RatingDisplay } from "@/components/rating-display"
import { CurrencyDisplay } from "@/components/currency-display"
import { ImageLoader } from "@/components/image-loader"

interface Collection {
  id: string
  title: string
  brand: string
  image_url: string
}

interface Product {
  id: string
  title: string
  brand: string
  price: number
  image_url: string
  affiliate_link: string
}

export function CollectionContent({ 
  collection, 
  products 
}: { 
  collection: Collection
  products: Product[]
}) {
  const productCount = products.length

  return (
    <div className="container mx-auto max-w-7xl px-4 pt-6 pb-32">
      <main>
        <div className="mb-8">
          {/* Collection Cover Image - Full Width on Mobile, Large on Desktop */}
          <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl mb-4">
            <ImageLoader
              src={collection.image_url || "/placeholder.svg?height=400&width=800"}
              alt={collection.title}
              className="w-full h-full"
              aspectRatio="16/9"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{collection.title}</h1>
              <p className="text-base md:text-lg text-white/90">
                {collection.brand || 'Our latest collection'}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <RatingDisplay
                  itemId={collection.id}
                  itemType="collection"
                />
                <p className="text-sm text-white/80">{productCount} items</p>
              </div>
            </div>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[5px] md:gap-x-6 gap-y-4">
            {products.map((product) => (
              <div key={product.id} className="group">
                <a
                  href={product.affiliate_link || "https://amzn.to/49SNT2h"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-sm">
                    <ImageLoader
                      src={product.image_url || "/placeholder.svg?height=400&width=300"}
                      alt={product.title}
                      className="w-full"
                      aspectRatio="3/4"
                    />
                    <div 
                      className="absolute top-2 left-2"
                      onClick={(e) => e.preventDefault()}
                    >
                      <RatingButton
                        itemId={product.id}
                        itemType="product"
                      />
                    </div>
                    <div 
                      className="absolute top-2 right-2"
                      onClick={(e) => e.preventDefault()}
                    >
                      <WishlistButton
                        productId={product.id}
                        className="h-7 w-7 flex items-center justify-center rounded-full bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm"
                      />
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <RatingDisplay
                        itemId={product.id}
                        itemType="product"
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{product.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{product.brand}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      <CurrencyDisplay price={product.price} />
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <p className="text-lg text-slate-600 dark:text-slate-400">No products in this collection yet</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">Check back soon for new arrivals</p>
          </div>
        )}
      </main>
    </div>
  )
}
