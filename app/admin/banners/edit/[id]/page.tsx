import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminBannerForm } from "@/components/admin/admin-banner-form"

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: banner } = await supabase.from("banners").select("*").eq("id", id).single()

  if (!banner) {
    redirect("/admin/banners")
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <AdminBannerForm banner={banner} />
    </div>
  )
}
