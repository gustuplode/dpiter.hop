import Link from "next/link"

export function CategoryHeader() {
  const categories = [
    {
      name: "Outfit",
      href: "/",
      image: "/stylish-streetwear-outfit.png"
    },
    {
      name: "Fashion",
      href: "/fashion",
      image: "/fashionable-shirt.jpg"
    },
    {
      name: "Gadgets",
      href: "/gadgets",
      image: "/modern-gadget-device.jpg"
    },
    {
      name: "Gaming",
      href: "/gaming",
      image: "/gaming-controller.png"
    },
    {
      name: "All Products",
      href: "/all-products",
      image: "/diverse-shopping-products.png"
    }
  ]

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 mb-4">
      <div className="container mx-auto max-w-7xl px-2">
        <div className="grid grid-cols-5 gap-1 py-2">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="flex flex-col items-center justify-center p-1 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden mb-1 flex-shrink-0">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[9px] md:text-xs font-medium text-slate-900 dark:text-white text-center leading-tight">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
