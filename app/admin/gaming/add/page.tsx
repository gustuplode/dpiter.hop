import { createClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'
import { AdminProductForm } from "@/components/admin/admin-product-form"

export default async function AddGamingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return <AdminProductForm category="gaming" />
}
