"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, ImageIcon, Video } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BannerListClient({ banners }: { banners: any[] }) {
  const router = useRouter()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {banners.map((banner) => (
        <BannerCard key={banner.id} banner={banner} router={router} />
      ))}
    </div>
  )
}

function BannerCard({ banner, router }: { banner: any; router: any }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = () => {
    console.log("[v0] Editing banner ID:", banner.id)
    router.push(`/admin/banners/edit/${banner.id}`)
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this banner?")) return

    setIsDeleting(true)
    console.log("[v0] Deleting banner ID:", banner.id)

    try {
      const response = await fetch(`/api/admin/banners/${banner.id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete banner")
      }

      console.log("[v0] Banner deleted successfully")
      router.refresh()
    } catch (error: any) {
      console.error("[v0] Delete error:", error)
      alert(`Failed to delete banner: ${error.message}`)
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all">
      {/* Banner Preview */}
      <div className="relative aspect-[16/7] bg-gray-100 dark:bg-gray-700">
        {banner.type === "image" ? (
          <img src={banner.media_url || "/placeholder.svg"} alt="Banner" className="w-full h-full object-cover" />
        ) : (
          <video src={banner.media_url} className="w-full h-full object-cover" muted loop />
        )}
        {/* Type Badge */}
        <div className="absolute top-2 right-2 bg-black/80 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
          {banner.type === "image" ? <ImageIcon className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
          {banner.type === "image" ? "Image" : "Video"}
        </div>
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              banner.is_active ? "bg-green-500 text-white" : "bg-gray-500 text-white"
            }`}
          >
            {banner.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Info & Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Position: <span className="text-gray-900 dark:text-white font-bold">{banner.position}</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleEdit} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white gap-2" size="sm">
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white gap-2 disabled:opacity-50"
            size="sm"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  )
}
