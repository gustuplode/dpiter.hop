import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BannerListClient } from "@/components/admin/banner-list-client"

// Server Component - fetches banner data and delegates client interactions to BannerListClient
export default async function BannersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: banners } = await supabase.from("banners").select("*").order("position", { ascending: true })

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <span className="material-symbols-outlined">arrow_back</span>
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Banner Management</h1>
          </div>
          <Link href="/admin/banners/add">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-5 w-5 mr-2" />
              Add Banner
            </Button>
          </Link>
        </div>
      </header>

      <main className="p-4">
        {!banners || banners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
              No Banners Yet
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
              Create your first banner to display on the home page
            </p>
            <Link href="/admin/banners/add">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-5 w-5 mr-2" />
                Create Banner
              </Button>
            </Link>
          </div>
        ) : (
          <BannerListClient banners={banners} />
        )}
      </main>
    </div>
  )
}
