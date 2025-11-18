"use client"

import { useState, useEffect } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User } from "firebase/auth"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface UserAvatarProps {
  size?: "sm" | "md" | "lg"
  className?: string
  asButton?: boolean
}

export function UserAvatar({ size = "md", className = "", asButton = false }: UserAvatarProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const supabase = createClient()

  const sizeClasses = {
    sm: "size-6 md:size-9",
    md: "size-9",
    lg: "size-12"
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      
      if (currentUser) {
        const { data } = await supabase
          .from("user_profiles")
          .select("profile_image_url")
          .eq("user_id", currentUser.uid)
          .single()
        
        if (data?.profile_image_url) {
          setProfileImage(data.profile_image_url)
        } else if (currentUser.photoURL) {
          setProfileImage(currentUser.photoURL)
        }
      } else {
        setProfileImage(null)
      }
    })

    const channel = supabase
      .channel("profile_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_profiles",
        },
        (payload: any) => {
          if (auth.currentUser && payload.new.user_id === auth.currentUser.uid) {
            setProfileImage(payload.new.profile_image_url)
          }
        }
      )
      .subscribe()

    return () => {
      unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [])

  const avatarContent = (
    <div className={`${sizeClasses[size]} ${className} shrink-0 rounded-full overflow-hidden border-2 transition-colors ${
      user ? "border-[#F97316] hover:border-[#EA580C]" : "border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
    }`}>
      {user && profileImage ? (
        <img 
          src={profileImage || "/placeholder.svg"} 
          alt={user.displayName || "User"} 
          className="w-full h-full object-cover"
        />
      ) : user ? (
        <div className="w-full h-full bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center text-white text-sm font-bold">
          {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="material-symbols-outlined text-slate-700 dark:text-slate-300 text-xl">person</span>
        </div>
      )}
    </div>
  )

  if (asButton) {
    return avatarContent
  }

  return (
    <Link href="/profile">
      {avatarContent}
    </Link>
  )
}
