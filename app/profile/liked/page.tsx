import { createClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'
import { ThumbsUp, ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { getProductUrl, getCollectionProductUrl } from "@/lib/utils"

export default async function LikedProductsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/profile")
  }

  const { data: likes } = await supabase
    .from("likes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const categoryProductIds = likes?.filter(l => l.item_type === 'category_product').map(l => l.item_id) || []
  const collectionProductIds = likes?.filter(l => l.item_type === 'product').map(l => l.item_id) || []

  let categoryProducts: any[] = []
  let collectionProducts: any[] = []

  if (categoryProductIds.length > 0) {
    const { data } = await supabase
      .from("category_products")
      .select("*")
      .in("id", categoryProductIds)
      .eq("is_visible", true)
    
    categoryProducts = data || []
  }

  if (collectionProductIds.length > 0) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .in("id", collectionProductIds)
      .eq("is_visible", true)
    
    collectionProducts = data || []
  }

  const totalLikes = categoryProducts.length + collectionProducts.length

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-4 sticky top-0 z-10">
        <div className="container mx-auto max-w-3xl flex items-center gap-4">
          <Link href="/profile" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Liked Products</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {totalLikes} product{totalLikes !== 1 ? 's' : ''} you liked
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-4 py-8">
        {totalLikes > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {categoryProducts.map((product) => (
              <Link
                key={product.id}
                href={getProductUrl(product.id, product.title, product.category)}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[3/4] relative">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full">
                    <ThumbsUp className="h-4 w-4 text-blue-500 fill-blue-500" />
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{product.brand}</p>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 mb-1">
                    {product.title}
                  </h3>
                  <p className="text-sm font-bold text-primary">₹{product.price}</p>
                </div>
              </Link>
            ))}
            
            {collectionProducts.map((product) => (
              <Link
                key={product.id}
                href={getCollectionProductUrl(product.collection_id, product.id, product.title)}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[3/4] relative">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full">
                    <ThumbsUp className="h-4 w-4 text-blue-500 fill-blue-500" />
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{product.brand}</p>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 mb-1">
                    {product.title}
                  </h3>
                  <p className="text-sm font-bold text-primary">₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center">
            <ThumbsUp className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Liked Products</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Start liking products to see them here
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
            >
              Explore Products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
