"use client"

import { useState, useEffect } from "react"
import { Star } from 'lucide-react'
import { createClient } from "@/lib/supabase/client"

interface RatingDisplayProps {
  itemId: string
  itemType: "collection" | "product"
  className?: string
}

export function RatingDisplay({ itemId, itemType, className = "" }: RatingDisplayProps) {
  const [displayRating, setDisplayRating] = useState(4.1)

  useEffect(() => {
    loadRating()
    
    const handleRatingUpdate = (event: any) => {
      if (event.detail.itemId === itemId && event.detail.itemType === itemType) {
        loadRating()
      }
    }
    
    window.addEventListener('ratingUpdated', handleRatingUpdate)
    return () => window.removeEventListener('ratingUpdated', handleRatingUpdate)
  }, [itemId])

  const loadRating = async () => {
    try {
      const supabase = createClient()
      
      const { data: ratings } = await supabase
        .from("ratings")
        .select("rating")
        .eq("item_id", itemId)
        .eq("item_type", itemType)

      if (ratings && ratings.length > 0) {
        // Count frequency of each rating
        const frequency: { [key: number]: number } = {}
        ratings.forEach(r => {
          frequency[r.rating] = (frequency[r.rating] || 0) + 1
        })
        
        // Find the most common rating (mode)
        let maxCount = 0
        let modeRating = 4
        Object.entries(frequency).forEach(([rating, count]) => {
          if (count > maxCount) {
            maxCount = count
            modeRating = parseInt(rating)
          }
        })
        
        // Display mode rating with .1 decimal (Meesho style)
        setDisplayRating(modeRating + 0.1)
      }
    } catch (error) {
      // Silently fail if table doesn't exist yet
    }
  }

  return (
    <div
      className={`flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded-md text-xs font-semibold shadow-sm ${className}`}
    >
      <Star className="w-3 h-3 fill-white" />
      <span>{displayRating}</span>
    </div>
  )
}
