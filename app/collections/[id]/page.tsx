import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { WishlistButton } from "@/components/wishlist-button"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: collection } = await supabase.from("collections").select("title, brand").eq("id", id).single()

  if (!collection) {
    return {
      title: "Collection Not Found",
    }
  }

  return {
    title: `${collection.title} - ${collection.brand} | Dpiter`,
    description: `Shop the ${collection.title} collection from ${collection.brand}. Discover curated products and exclusive deals.`,
    openGraph: {
      title: `${collection.title} - ${collection.brand}`,
      description: `Shop the ${collection.title} collection from ${collection.brand}`,
    },
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: collection } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single()

  if (!collection) {
    notFound()
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("collection_id", collection.id)
    .eq("is_visible", true)
    .order("created_at", { ascending: false })

  const productCount = products?.length || 0

  return (
    <div className="mx-auto max-w-sm bg-[#F8FAFC] dark:bg-[#1E293B] shadow-lg min-h-screen flex flex-col">
      <main className="flex-grow px-4 pt-4 pb-20">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 pr-4">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{collection.title}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {collection.brand} - Our latest collection of premium products
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{productCount} items</p>
          </div>
          <div className="w-24 h-24 rounded-lg overflow-hidden shadow-md flex-shrink-0">
            <img
              alt={collection.title}
              className="w-full h-full object-cover"
              src={collection.image_url || "/placeholder.svg?height=128&width=128"}
            />
          </div>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <div key={product.id} className="flex flex-col">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    alt={product.title}
                    className="w-full h-auto aspect-[3/4] object-cover"
                    src={product.image_url || "/placeholder.svg?height=400&width=300"}
                  />
                  <div className="absolute top-2 right-2">
                    <WishlistButton productId={product.id} className="bg-black/20 backdrop-blur-sm" />
                  </div>
                </div>
                <a href={product.affiliate_link || "#"} target="_blank" rel="noopener noreferrer" className="pt-2">
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{product.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{product.brand}</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
                    ${product.price.toFixed(2)}
                  </p>
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

      <BottomNav />
    </div>
  )
}
