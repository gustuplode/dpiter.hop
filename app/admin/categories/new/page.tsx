import { createClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'
import { CategoryProductForm } from "@/components/admin/category-product-form"

export default async function NewCategoryProductPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const supabase = await createClient()
  const params = await searchParams

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const category = params.category || 'fashion'

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#F4F4F7] dark:bg-[#1a1a1d]">
      <CategoryProductForm category={category} />
    </div>
  )
}
