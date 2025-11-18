"use client"

import { useState, useEffect } from "react"
import { X, Package, Download } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface LogoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LogoModal({ isOpen, onClose }: LogoModalProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    
    window.addEventListener('beforeinstallprompt', handler)
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  if (!isOpen) return null

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      }
      setDeferredPrompt(null)
    } else {
      // Fallback for browsers that don't support PWA installation
      alert('To install the app:\n\n1. Tap the Share button (iOS) or Menu (Android)\n2. Select "Add to Home Screen"\n3. Enjoy the app!')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Sheet */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[2rem] shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Curved Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
        </div>

        {/* Content */}
        <div className="px-6 pb-8 pt-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quick Actions</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          <div className="space-y-3">
            <Link href="/request-product" onClick={onClose}>
              <Button
                className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg"
              >
                <Package className="h-6 w-6 mr-3" />
                Request Product
              </Button>
            </Link>

            <Button
              onClick={handleInstallApp}
              className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg"
            >
              <Download className="h-6 w-6 mr-3" />
              Install App
            </Button>
          </div>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Request products you want to see listed or install our app for quick access
          </p>
        </div>
      </div>
    </div>
  )
}
