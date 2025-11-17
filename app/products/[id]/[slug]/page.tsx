import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from 'next/navigation'
import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"
import { RatingDisplay } from "@/components/rating-display"
import { CurrencyDisplay } from "@/components/currency-display"
import { BackButton } from "@/components/back-button"
import { generateSlug, getProductUrl } from "@/lib/utils"
import Link from "next/link"

export async function generateMetadata({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  try {
    const { data: product } = await supabase
      .from("category_products")
      .select("*")
      .eq("id", id)
      .single()

    if (product) {
      return {
        title: `${product.title} - ${product.brand} | Dpiter`,
        description: `Buy ${product.title} from ${product.brand} at best price. Rating: ${product.rating || 'Not rated yet'}`,
      }
    }
  } catch (error) {
    console.error("[v0] Error generating metadata:", error)
  }

  return {
    title: "Product Details - Dpiter",
    description: "View product details on Dpiter"
  }
}

export default async function CategoryProductDetailPage({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id, slug } = await params
  const supabase = await createClient()

  let product: any = null
  let suggestedProducts: any[] = []

  try {
    const { data, error } = await supabase
      .from("category_products")
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw error
    product = data

    // Check if slug matches
    const correctSlug = generateSlug(product.title)
    if (slug !== correctSlug) {
      redirect(getProductUrl(product.id, product.title, 'category'))
    }

    // Get suggested products from same category
    const { data: suggested } = await supabase
      .from("category_products")
      .select("*")
      .eq("category", product.category)
      .eq("visible", true)
      .neq("id", id)
      .order("created_at", { ascending: false })
      .limit(10)

    suggestedProducts = suggested || []
  } catch (error) {
    console.error("[v0] Error loading product:", error)
    notFound()
  }

  if (!product) {
    notFound()
  }

  const getCategoryBadge = (category: string) => {
    const badges = {
      fashion: { color: "bg-pink-500", label: "Fashion" },
      gadgets: { color: "bg-blue-500", label: "Gadgets" },
      gaming: { color: "bg-purple-500", label: "Gaming" }
    }
    return badges[category as keyof typeof badges] || badges.fashion
  }

  const badge = getCategoryBadge(product.category)

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <div className="container mx-auto max-w-4xl px-4 pt-4 pb-32">
        <BackButton />

        <main className="mt-4">
          {/* Product Image */}
          <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-lg aspect-[3/4] mb-4">
            <img
              src={product.image_url || "/placeholder.svg?height=600&width=450"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <RatingButton itemId={product.id} itemType="category_product" />
            </div>
            <div className="absolute top-4 right-4">
              <WishlistButton
                productId={product.id}
                type="category_product"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
                showText={false}
              />
            </div>
            <div className="absolute bottom-4 left-4">
              <span className={`inline-flex items-center gap-1 rounded-md ${badge.color} px-3 py-1 text-sm font-medium text-white`}>
                {badge.label}
              </span>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {product.title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
              {product.brand}
            </p>
            <div className="flex items-center justify-between mb-4">
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                <CurrencyDisplay price={product.price} />
              </p>
              <RatingDisplay itemId={product.id} itemType="category_product" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="fixed bottom-20 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 z-10">
            <div className="container mx-auto max-w-4xl flex gap-3">
              <a
                href={product.affiliate_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
              >
                Buy Now
              </a>
              <WishlistButton
                productId={product.id}
                type="category_product"
                className="flex-1 border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6]/10 font-semibold py-3 px-6 rounded-lg transition-colors"
                showText={true}
              />
            </div>
          </div>

          {/* Suggested Products */}
          {suggestedProducts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Similar Products
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[5px] md:gap-x-4 gap-y-4">
                {suggestedProducts.map((suggestedProduct) => {
                  const suggestedBadge = getCategoryBadge(suggestedProduct.category)
                  return (
                    <div key={suggestedProduct.id} className="group">
                      <Link
                        href={getProductUrl(suggestedProduct.id, suggestedProduct.title, 'category')}
                        className="block"
                      >
                        <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-sm aspect-[3/4]">
                          <img
                            src={suggestedProduct.image_url || "/placeholder.svg?height=400&width=300"}
                            alt={suggestedProduct.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute bottom-2 left-2">
                            <span className={`inline-flex items-center gap-1 rounded-md ${suggestedBadge.color}/90 px-2 py-0.5 text-xs font-medium text-white`}>
                              {suggestedBadge.label}
                            </span>
                          </div>
                          <div className="absolute bottom-2 right-2">
                            <RatingDisplay itemId={suggestedProduct.id} itemType="category_product" />
                          </div>
                        </div>
                        <div className="pt-2">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {suggestedProduct.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{suggestedProduct.brand}</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                            <CurrencyDisplay price={suggestedProduct.price} />
                          </p>
                        </div>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      <FooterLinks />
      <BottomNav />
    </div>
  )
}
