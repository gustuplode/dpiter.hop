import { createClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'
import { AdminProductForm } from "@/components/admin/admin-product-form"

export default async function AddFashionProduct() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return <AdminProductForm category="fashion" />
}
