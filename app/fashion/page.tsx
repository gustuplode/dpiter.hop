import { createClient } from "@/lib/supabase/server"
import { CategoryPageLayout } from "@/components/category-page-layout"

export const metadata = {
  title: "Fashion - Dpiter",
  description: "Browse our curated collection of fashion products",
}

export default async function FashionPage() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from("category_products")
    .select("*")
    .eq("category", "fashion")
    .eq("is_visible", true)
    .order("created_at", { ascending: false })

  return <CategoryPageLayout title="Fashion" products={products || []} error={error} />
}
