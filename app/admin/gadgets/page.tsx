import { createClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'
import { AdminProductList } from "@/components/admin/admin-product-list"

export default async function GadgetsAdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: products } = await supabase
    .from("category_products")
    .select("*")
    .eq("category", "gadgets")
    .order("created_at", { ascending: false })

  return <AdminProductList category="gadgets" initialProducts={products || []} />
}
