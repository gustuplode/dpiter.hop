"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Edit, Trash2, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface CategoryProduct {
  id: string
  title: string
  brand: string
  price: number
  image_url: string
  category: string
}

interface CategoryProductCardProps {
  product: CategoryProduct
}

export function CategoryProductCard({ product }: CategoryProductCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClient()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!confirm("Are you sure you want to delete this product?")) return

    setIsDeleting(true)

    try {
      const { error } = await supabase
        .from("category_products")
        .delete()
        .eq("id", product.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Failed to delete product. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-[#2a2a2e] rounded-lg p-3 shadow-sm relative group">
      <img 
        src={product.image_url || "/placeholder.svg"} 
        alt={product.title} 
        className="w-full h-40 object-cover rounded mb-2" 
      />
      <h3 className="font-semibold text-sm">{product.brand}</h3>
      <p className="text-xs text-slate-500 line-clamp-2">{product.title}</p>
      <p className="text-sm font-bold mt-1">₹{product.price}</p>
      
      {/* Edit/Delete buttons shown on hover */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link href={`/admin/categories/${product.id}/edit`}>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white dark:bg-slate-700"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
        <Button
          size="sm"
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="h-8 w-8 p-0"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
