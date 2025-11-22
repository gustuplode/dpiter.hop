"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, ImageIcon, Video } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BannerListClient({ banners }: { banners: any[] }) {
  const router = useRouter()

  return (
    <div className="space-y-4">
      {banners.map((banner) => (
        <BannerCard key={banner.id} banner={banner} router={router} />
      ))}
    </div>
  )
}

function BannerCard({ banner, router }: { banner: any; router: any }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = async () => {
    console.log("[v0] Navigating to edit page:", `/admin/banners/edit/${banner.id}`)
    router.push(`/admin/banners/edit/${banner.id}`)
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this banner?")) return

    setIsDeleting(true)
    console.log("[v0] Deleting banner:", banner.id)

    try {
      const response = await fetch(`/api/admin/banners/${banner.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete banner")
      }

      console.log("[v0] Banner deleted successfully")
      window.location.href = "/admin/banners"
    } catch (error) {
      console.error("[v0] Delete error:", error)
      alert("Failed to delete banner. Please try again.")
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 p-4">
        {/* Preview */}
        <div className="relative w-28 h-28 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
          {banner.type === "image" ? (
            <img src={banner.media_url || "/placeholder.svg"} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <video src={banner.media_url} className="w-full h-full object-cover" muted />
          )}
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
            {banner.type === "image" ? <ImageIcon className="w-3 h-3" /> : <Video className="w-3 h-3" />}
            {banner.type}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                banner.is_active
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              {banner.is_active ? "Active" : "Inactive"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Position: {banner.position}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {banner.type === "image" ? "Image Banner" : "Video Banner"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleEdit}
            variant="outline"
            size="sm"
            className="gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-900/20 bg-transparent"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="outline"
            size="sm"
            className="gap-2 text-red-600 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:hover:bg-red-900/20 bg-transparent"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  )
}
