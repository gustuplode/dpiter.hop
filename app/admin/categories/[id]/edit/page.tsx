import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from 'next/navigation'
import { CategoryProductForm } from "@/components/admin/category-product-form"

export default async function EditCategoryProductPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: product, error } = await supabase
    .from("category_products")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !product) {
    notFound()
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#F4F4F7] dark:bg-[#1a1a1d]">
      <CategoryProductForm product={product} category={product.category} />
    </div>
  )
}
