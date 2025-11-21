import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"

export const metadata = {
  title: "Outfit - Dpiter",
  description: "Browse our curated outfit collections",
}

export default async function OutfitPage() {
  const supabase = await createClient()

  const { data: collections, error } = await supabase
    .from("collections")
    .select(`
      *,
      products (count)
    `)
    .eq("status", "published")
    .order("created_at", { ascending: false })

  const collectionsWithCount = collections?.map((col) => ({
    ...col,
    product_count: col.products?.[0]?.count ?? col.product_count ?? 0,
  }))

  return (
    <div className="flex flex-col pb-20">
      {collectionsWithCount && collectionsWithCount.length > 0 ? (
        <div className="grid grid-cols-2 lg:gap-4 xl:grid-cols-6">
          {collectionsWithCount.map((collection, index) => (
            <div
              key={collection.id}
              className="flex flex-col bg-white dark:bg-gray-800 overflow-hidden border-t border-r border-[#8A3224] dark:border-[#8A3224] lg:rounded-lg lg:border hover:shadow-lg transition-shadow"
            >
              <Link href={`/collections/${collection.id}`} className="block">
                <div className="relative w-full bg-center bg-no-repeat aspect-square bg-cover">
                  <img
                    src={collection.image_url || "/placeholder.svg?height=1080&width=1080"}
                    alt={collection.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-1.5 left-1.5 flex items-center bg-white/95 backdrop-blur-sm rounded px-1.5 py-0.5 shadow-sm">
                    <span className="text-[10px] font-semibold text-gray-800">4.1</span>
                  </div>
                </div>
              </Link>

              <div className="p-2 flex flex-col gap-1 bg-[#F7F7F7] dark:bg-gray-800">
                <p className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400 tracking-wider">
                  {collection.brand || "COLLECTION"}
                </p>
                <p className="text-gray-800 dark:text-gray-200 text-[11px] font-normal leading-snug line-clamp-1">
                  {collection.title}
                </p>

                <div className="flex items-center justify-between mt-1">
                  <p className="text-gray-900 dark:text-white text-sm font-bold">{collection.product_count} items</p>
                  <div className="flex items-center gap-0.5">
                    <WishlistButton
                      productId={collection.id}
                      className="flex items-center justify-center h-6 w-6 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                    />
                    <RatingButton
                      itemId={collection.id}
                      itemType="collection"
                      className="flex items-center justify-center h-6 w-6 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                    />
                    <Link
                      href={`/collections/${collection.id}`}
                      className="flex items-center justify-center h-6 w-6 text-primary hover:text-primary/80 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark">
            {error ? "Unable to load collections" : "No outfit collections available yet"}
          </p>
        </div>
      )}
    </div>
  )
}
