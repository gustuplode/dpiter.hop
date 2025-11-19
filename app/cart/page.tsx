import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"

export const metadata = {
  title: "Cart - Dpiter",
  description: "View your shopping cart",
}

export default function CartPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <main className="flex-1 pb-20 px-4">
        <div className="max-w-4xl mx-auto py-8">
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
            Shopping Cart
          </h1>
          
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-32 w-32 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600">
                shopping_cart
              </span>
            </div>
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
              Your cart is empty
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
              Add products to your cart to see them here
            </p>
            <Link 
              href="/"
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  )
}
