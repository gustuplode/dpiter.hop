"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  brand: string
  title: string
  price: number
  image_url: string
  affiliate_link: string
  category: string
  is_visible: boolean
}

export function AdminProductList({ category, initialProducts }: { category: string; initialProducts: Product[] }) {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
    if (res.ok) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <header className="flex items-center bg-white dark:bg-gray-900 px-4 py-3 gap-3 border-b border-gray-200 dark:border-gray-700">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark capitalize">
          {category} Products
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">No products yet</p>
            <Link href={`/admin/${category}/add`}>
              <Button>Add First Product</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <img src={product.image_url || "/placeholder.svg"} alt={product.title} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-primary-light dark:text-text-primary-dark truncate">
                    {product.title}
                  </p>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{product.brand}</p>
                  <p className="text-sm font-bold text-primary">₹{product.price.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/${category}/edit/${product.id}`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Link href={`/admin/${category}/add`} className="fixed bottom-6 right-6 z-20">
        <Button className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl p-0">
          <Plus className="h-7 w-7" />
        </Button>
      </Link>
    </div>
  )
}
