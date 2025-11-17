"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Upload } from 'lucide-react'
import Link from "next/link"
import { ImageCropper } from "./image-cropper"
import { put } from "@vercel/blob"

interface CategoryProductFormProps {
  product?: any
  category: string
}

export function CategoryProductForm({ product, category }: CategoryProductFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: product?.title || "",
    brand: product?.brand || "",
    price: product?.price || "",
    image_url: product?.image_url || "",
    affiliate_link: product?.affiliate_link || "",
    category: product?.category || category,
    visible: product?.visible ?? true,
  })

  const [showCropper, setShowCropper] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string)
        setShowCropper(true)
      }
      reader.readAsDataURL(file)
    }
    e.target.value = ''
  }

  const handleCroppedImage = async (croppedImageBlob: Blob) => {
    setUploading(true)
    try {
      const fileName = `category-product-${Date.now()}.jpg`
      const blob = await put(fileName, croppedImageBlob, {
        access: 'public',
        token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN,
      })

      setFormData({ ...formData, image_url: blob.url })
      setShowCropper(false)
      setSelectedImage(null)
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
      }

      if (product) {
        const { error } = await supabase
          .from("category_products")
          .update(productData)
          .eq("id", product.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from("category_products")
          .insert([productData])

        if (error) throw error
      }

      router.push("/admin/categories")
      router.refresh()
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Failed to save product")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!product || !confirm("Are you sure you want to delete this product?")) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from("category_products")
        .delete()
        .eq("id", product.id)

      if (error) throw error

      router.push("/admin/categories")
      router.refresh()
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Failed to delete product")
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = () => {
    const colors = {
      fashion: "bg-pink-500 hover:bg-pink-600",
      gadgets: "bg-blue-500 hover:bg-blue-600",
      gaming: "bg-purple-500 hover:bg-purple-600"
    }
    return colors[formData.category as keyof typeof colors] || colors.fashion
  }

  return (
    <>
      <header className="flex items-center bg-white dark:bg-[#2a2a2e] p-4 pb-3 justify-between sticky top-0 z-10 border-b border-[#E5E7EB] dark:border-[#4a4a50]">
        <Link href="/admin/categories" className="text-[#333333] dark:text-[#E5E7EB]">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-[#333333] dark:text-[#E5E7EB] text-xl font-bold">
          {product ? `Edit ${formData.category}` : `Add ${formData.category}`}
        </h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 px-4 py-6">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white dark:bg-[#2a2a2e] rounded-lg p-6 space-y-4">
            <div>
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Enter product title"
              />
            </div>

            <div>
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
                placeholder="Enter brand name"
              />
            </div>

            <div>
              <Label htmlFor="price">Price (INR) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                placeholder="Enter price"
              />
            </div>

            <div>
              <Label>Product Image *</Label>
              <div className="mt-2">
                {formData.image_url && !showCropper ? (
                  <div className="space-y-2">
                    <img
                      src={formData.image_url || "/placeholder.svg"}
                      alt="Product preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <label className="cursor-pointer">
                      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                        <Upload className="h-4 w-4" />
                        <span className="text-sm font-medium">Change Image</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : !showCropper ? (
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors border-2 border-dashed border-slate-300 dark:border-slate-600">
                      <Upload className="h-8 w-8 text-slate-500" />
                      <span className="text-sm font-medium">Upload Product Image</span>
                      <span className="text-xs text-slate-500">Click to select an image</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      required={!product}
                    />
                  </label>
                ) : null}
              </div>
            </div>

            <div>
              <Label htmlFor="affiliate_link">Affiliate Link *</Label>
              <Input
                id="affiliate_link"
                type="url"
                value={formData.affiliate_link}
                onChange={(e) => setFormData({ ...formData, affiliate_link: e.target.value })}
                required
                placeholder="https://example.com/product"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="visible">Visible to public</Label>
              <Switch
                id="visible"
                checked={formData.visible}
                onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading || uploading}
              className={`flex-1 text-white ${getCategoryColor()}`}
            >
              {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
            </Button>
            {product && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete
              </Button>
            )}
          </div>
        </form>
      </main>

      {showCropper && selectedImage && (
        <ImageCropper
          image={selectedImage}
          onCropComplete={handleCroppedImage}
          onCancel={() => {
            setShowCropper(false)
            setSelectedImage(null)
          }}
          aspectRatio={3 / 4}
        />
      )}
    </>
  )
}
