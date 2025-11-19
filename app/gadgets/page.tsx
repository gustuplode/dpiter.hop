import { createClient } from "@/lib/supabase/server"
import { CategoryPageLayout } from "@/components/category-page-layout"

export const metadata = {
  title: "Gadgets - Dpiter",
  description: "Browse our curated collection of gadgets",
}

export default async function GadgetsPage() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from("category_products")
    .select("*")
    .eq("category", "gadgets")
    .eq("is_visible", true)
    .order("created_at", { ascending: false })

  return <CategoryPageLayout title="Gadgets" products={products || []} error={error} />
}
