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
  const isScrolling = useRef<boolean>(false)

  const pages = ["/", "/fashion", "/gadgets", "/gaming", "/outfit"]

  const handleSwipe = () => {
    if (isScrolling.current) return

    const diff = touchStartX.current - touchEndX.current
    const threshold = 50

    if (Math.abs(diff) < threshold) return

    const currentIndex = pages.indexOf(pathname)
    if (currentIndex === -1) return

    if (diff > 0) {
      if (currentIndex < pages.length - 1) {
        router.push(pages[currentIndex + 1])
      }
    } else {
      if (currentIndex > 0) {
        router.push(pages[currentIndex - 1])
      }
    }
  }

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX
      isScrolling.current = false
    }

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX
      const verticalDiff = Math.abs(e.touches[0].clientY - (e.touches[0] as any).startY)
      const horizontalDiff = Math.abs(touchStartX.current - touchEndX.current)

      if (verticalDiff > horizontalDiff) {
        isScrolling.current = true
      }
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
