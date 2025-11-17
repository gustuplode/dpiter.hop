import { createClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function CategoriesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  let products: any[] = []
  let error = null

  try {
    const { data, error: fetchError } = await supabase
      .from("category_products")
      .select("*")
      .order("created_at", { ascending: false })

    if (fetchError) {
      error = fetchError
    } else {
      products = data || []
    }
  } catch (e) {
    error = e
  }

  const fashionProducts = products.filter(p => p.category === 'fashion')
  const gadgetsProducts = products.filter(p => p.category === 'gadgets')
  const gamingProducts = products.filter(p => p.category === 'gaming')

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#F4F4F7] dark:bg-[#1a1a1d]">
      <header className="flex items-center bg-white dark:bg-[#2a2a2e] p-4 pb-3 justify-between sticky top-0 z-10 border-b border-[#E5E7EB] dark:border-[#4a4a50]">
        <Link href="/admin" className="text-[#333333] dark:text-[#E5E7EB]">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-[#333333] dark:text-[#E5E7EB] text-xl font-bold">Categories</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 px-4 py-4">
        {error ? (
          <div className="bg-white dark:bg-[#2a2a2e] rounded-lg p-6 text-center">
            <p className="text-[#333333] dark:text-[#E5E7EB] mb-2">Unable to load category products</p>
            <p className="text-sm text-[#333333]/70 dark:text-[#E5E7EB]/70">
              Please run the SQL script (scripts/009_create_category_products.sql) to create the category_products table.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Fashion */}
            <div className="bg-white dark:bg-[#2a2a2e] rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#333333] dark:text-[#E5E7EB]">
                  Fashion ({fashionProducts.length})
                </h2>
                <Link href="/admin/categories/new?category=fashion">
                  <Button className="bg-pink-500 hover:bg-pink-600 text-white">Add Product</Button>
                </Link>
              </div>
              {fashionProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {fashionProducts.map(product => (
                    <Link key={product.id} href={`/admin/categories/${product.id}/edit`} className="block">
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                        <img src={product.image_url || "/placeholder.svg"} alt={product.title} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-sm font-medium text-[#333333] dark:text-[#E5E7EB] mt-2 truncate">{product.title}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#333333]/70 dark:text-[#E5E7EB]/70">No fashion products yet</p>
              )}
            </div>

            {/* Gadgets */}
            <div className="bg-white dark:bg-[#2a2a2e] rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#333333] dark:text-[#E5E7EB]">
                  Gadgets ({gadgetsProducts.length})
                </h2>
                <Link href="/admin/categories/new?category=gadgets">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">Add Product</Button>
                </Link>
              </div>
              {gadgetsProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {gadgetsProducts.map(product => (
                    <Link key={product.id} href={`/admin/categories/${product.id}/edit`} className="block">
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                        <img src={product.image_url || "/placeholder.svg"} alt={product.title} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-sm font-medium text-[#333333] dark:text-[#E5E7EB] mt-2 truncate">{product.title}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#333333]/70 dark:text-[#E5E7EB]/70">No gadgets yet</p>
              )}
            </div>

            {/* Gaming */}
            <div className="bg-white dark:bg-[#2a2a2e] rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#333333] dark:text-[#E5E7EB]">
                  Gaming ({gamingProducts.length})
                </h2>
                <Link href="/admin/categories/new?category=gaming">
                  <Button className="bg-purple-500 hover:bg-purple-600 text-white">Add Product</Button>
                </Link>
              </div>
              {gamingProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {gamingProducts.map(product => (
                    <Link key={product.id} href={`/admin/categories/${product.id}/edit`} className="block">
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                        <img src={product.image_url || "/placeholder.svg"} alt={product.title} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-sm font-medium text-[#333333] dark:text-[#E5E7EB] mt-2 truncate">{product.title}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#333333]/70 dark:text-[#E5E7EB]/70">No gaming products yet</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
