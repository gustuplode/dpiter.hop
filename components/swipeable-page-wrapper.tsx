"use client"

import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

interface SwipeablePageWrapperProps {
  children: React.ReactNode
}

export function SwipeablePageWrapper({ children }: SwipeablePageWrapperProps) {
  const router = useRouter()
  const pathname = usePathname()
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const pages = ["/", "/fashion", "/gadgets", "/gaming"]

  const handleSwipe = () => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50 // minimum swipe distance

    if (Math.abs(diff) < threshold) return

    const currentIndex = pages.indexOf(pathname)
    if (currentIndex === -1) return

    if (diff > 0) {
      // Swiped left - go to next page
      if (currentIndex < pages.length - 1) {
        router.push(pages[currentIndex + 1])
      }
    } else {
      // Swiped right - go to previous page
      if (currentIndex > 0) {
        router.push(pages[currentIndex - 1])
      }
    }
  }

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX
    }

    const handleTouchEnd = () => {
      handleSwipe()
    }

    document.addEventListener("touchstart", handleTouchStart)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [pathname])

  return <div className="swipeable-content">{children}</div>
}
