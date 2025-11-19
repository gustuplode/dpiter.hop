import { createClient } from "@/lib/supabase/server"
import { CategoryPageLayout } from "@/components/category-page-layout"

export const metadata = {
  title: "Outfit - Dpiter",
  description: "Browse our curated collection of outfits",
}

export default async function OutfitPage() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from("category_products")
    .select("*")
    .eq("category", "outfit")
    .eq("is_visible", true)
    .order("created_at", { ascending: false })

  return <CategoryPageLayout title="Outfit" products={products || []} error={error} />
}
