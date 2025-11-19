"use client"

import { useState } from "react"
import { ArrowLeft, Upload, X } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { ImageCropper } from "./image-cropper"
import { put } from "@vercel/blob"

interface ProductFormProps {
  category: string
  initialData?: {
    id: string
    brand: string
    title: string
    price: number
    image_url: string
    affiliate_link: string
  }
}

export function AdminProductForm({ category, initialData }: ProductFormProps) {
  const router = useRouter()
  const [brand, setBrand] = useState(initialData?.brand || "")
  const [title, setTitle] = useState(initialData?.title || "")
  const [price, setPrice] = useState(initialData?.price?.toString() || "")
  const [affiliateLink, setAffiliateLink] = useState(initialData?.affiliate_link || "")
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "")
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setTempImageUrl(url)
      setShowCropper(true)
    }
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    setLoading(true)
    try {
      const file = new File([croppedBlob], `product-${Date.now()}.jpg`, { type: "image/jpeg" })
      const blob = await put(file.name, file, { access: "public" })
      setImageUrl(blob.url)
      setShowCropper(false)
      setTempImageUrl(null)
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!brand || !title || !price || !imageUrl) {
      alert("Please fill all fields and upload an image")
      return
    }

    setLoading(true)
    try {
      const payload = {
        brand,
        title,
        price: parseFloat(price),
        image_url: imageUrl,
        affiliate_link: affiliateLink,
        category,
        is_visible: true,
      }

      const res = initialData
        ? await fetch(`/api/admin/products/${initialData.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })

      if (res.ok) {
        router.push(`/admin/${category}`)
        router.refresh()
      } else {
        alert("Failed to save product")
      }
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Failed to save product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <header className="flex items-center bg-white dark:bg-gray-900 px-4 py-3 gap-3 border-b border-gray-200 dark:border-gray-700">
        <Link href={`/admin/${category}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
          {initialData ? "Edit" : "Add"} Product
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            Brand Name
          </label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary"
            placeholder="e.g., TECHCORP"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            Product Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary"
            placeholder="e.g., Smartwatch Pro X"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            Price (₹)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary"
            placeholder="20699"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            Affiliate Link
          </label>
          <input
            type="url"
            value={affiliateLink}
            onChange={(e) => setAffiliateLink(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            Product Image
          </label>
          {imageUrl ? (
            <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img src={imageUrl || "/placeholder.svg"} alt="Product" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Click to upload image</span>
              <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            </label>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold">
          {loading ? "Publishing..." : initialData ? "Update Product" : "Publish Product"}
        </Button>
      </form>

      {showCropper && tempImageUrl && (
        <ImageCropper
          imageUrl={tempImageUrl}
          aspectRatio={1}
          cropWidth={500}
          cropHeight={500}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowCropper(false)
            setTempImageUrl(null)
          }}
        />
      )}
    </div>
  )
}
