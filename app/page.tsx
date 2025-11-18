import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import { CategoryHeader } from "@/components/category-header"
import { SearchHeader } from "@/components/search-header"
import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"
import { RatingDisplay } from "@/components/rating-display"
import { getCollectionUrl } from "@/lib/utils"
import { Suspense } from "react"
import { CollectionGridSkeleton } from "@/components/collection-skeleton"

async function CollectionList() {
  const supabase = await createClient()

  let collections: any[] = []
  let error = null

  try {
    const { data, error: fetchError } = await supabase
      .from("collections")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })

    if (fetchError) {
      error = fetchError
    } else {
      collections = data || []
    }
  } catch (e) {
    error = e
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.shop"

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": collections.map((collection, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": collection.title,
        "brand": collection.brand,
        "image": collection.image_url,
        "url": `${baseUrl}${getCollectionUrl(collection.id, collection.title)}`,
        "offers": {
          "@type": "AggregateOffer",
          "availability": "https://schema.org/InStock",
          "priceCurrency": "INR"
        }
      }
    }))
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <p className="text-lg text-slate-600 dark:text-slate-400">Unable to load collections</p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
          Please make sure the database tables are created.
        </p>
      </div>
    )
  }

  if (collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <p className="text-lg text-slate-600 dark:text-slate-400">No collections available yet</p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
          Collections will appear here once they are published
        </p>
      </div>
    )
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-1 md:gap-x-2 gap-y-2 md:gap-y-3">
        {collections.map((collection) => (
          <div key={collection.id} className="group">
            <Link href={getCollectionUrl(collection.id, collection.title)} className="block">
              <div className="relative overflow-hidden rounded-md bg-white dark:bg-slate-800 shadow-sm aspect-[3/4]">
                <img
                  src={collection.image_url || "/placeholder.svg?height=400&width=300"}
                  alt={collection.title}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  loading="lazy"
                />
                <div className="absolute top-1.5 left-1.5">
                  <RatingButton
                    itemId={collection.id}
                    itemType="collection"
                  />
                </div>
                <div className="absolute top-1.5 right-1.5">
                  <WishlistButton
                    productId={collection.id}
                    type="collection"
                    className="h-6 w-6 flex items-center justify-center rounded-full bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm"
                  />
                </div>
                <div className="absolute bottom-1.5 right-1.5">
                  <RatingDisplay
                    itemId={collection.id}
                    itemType="collection"
                  />
                </div>
                {collection.is_limited_time && (
                  <div className="absolute bottom-1.5 left-1.5">
                    <span className="inline-flex items-center gap-0.5 rounded-md bg-[#3B82F6]/90 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      <span className="material-symbols-outlined text-xs">schedule</span>
                      LIMITED
                    </span>
                  </div>
                )}
              </div>
              <div className="pt-1.5">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-white truncate">{collection.brand}</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{collection.title}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <SearchHeader />
      <CategoryHeader 
        fashionCount={0}
        gadgetsCount={0}
        gamingCount={0}
        allProductsCount={0}
      />
      
      <div className="container mx-auto max-w-7xl px-1.5 pt-1 pb-32">
        <main>
          <Suspense fallback={<CollectionGridSkeleton />}>
            <CollectionList />
          </Suspense>
        </main>
      </div>

      <FooterLinks />
      <BottomNav />
    </div>
  )
}
