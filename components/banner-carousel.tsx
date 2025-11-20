"use client"

import { useState } from "react"

export function BannerCarousel() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const banners = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCIdhfHPQERaI5PPdd04MvO3BdaarPHqT_-vnTwWFitc1ULELL0MqX_YanzRip66kUgdtY8eJss3VZUuDKjPLEsjETIjTaXR5fJVNiIKFCmlOtMvyNxWSf2l8spgc3kao2y2L4fA31ww9sfvXOsV5jGIOf8lbwy243Lst38C1OunLL9E-h33TrGeGoHsPYBlZyI2x0oazLmKCvK7mU8Lt0cizPm43i7G9HjD5KgoWBZS54C7-kAmxbRIRASAKFnIxR0m_aRGnzYyk7I",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCzQ5vrlhemfKhhO6mDwODsCnXvTOg3F5EK6vahMsrMHj0_3hsGucRUiMOJUbp_AWaoAoGTi_2x_dEB7_3CUOy3uSGn9BFOyZWmxvFjfSpem30OUV9mDjjdqyozKLuZlI0aySANfs-0HGGAFKln5cI0HVoG_R7385SuCJuYvwONIgniXdgFOSQtBKNkrPUozAsoc_Aha9NhzpS5CG8Z9k-RjqQ6jpUw9eZCde83W4kVPDpV6MKzHar5Kvxhya8CdrsbJXh9VqKbkROI",
  ]

  return (
    <div className="mb-4 relative">
      <div
        className="w-full bg-center bg-no-repeat aspect-[16/7] md:aspect-[24/7] bg-cover transition-all duration-500"
        style={{
          backgroundImage: `url("${banners[currentBanner]}")`,
        }}
      ></div>
      <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentBanner ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
