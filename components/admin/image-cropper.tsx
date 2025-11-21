"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

interface ImageCropperProps {
  imageUrl: string
  aspectRatio?: number
  onCropComplete: (croppedImage: Blob) => void
  onCancel: () => void
  cropWidth?: number
  cropHeight?: number
}

export function ImageCropper({
  imageUrl,
  aspectRatio = 1,
  onCropComplete,
  onCancel,
  cropWidth = 1080,
  cropHeight = 1080,
}: ImageCropperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [containerSize, setContainerSize] = useState({ width: 400, height: 400 })

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setImage(img)
      setZoom(1)
      setPosition({ x: 0, y: 0 })
    }
    img.src = imageUrl
  }, [imageUrl])

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const size = Math.min(window.innerWidth - 40, window.innerHeight - 200, 500)
        setContainerSize({ width: size, height: size })
      }
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !image) return
    e.preventDefault()
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      setIsDragging(true)
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1 || !image) return
    e.preventDefault()
    const touch = e.touches[0]
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 5))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.1))
  }

  const handleReset = () => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleApplyCrop = () => {
    if (!image) return

    const canvas = document.createElement("canvas")
    canvas.width = cropWidth
    canvas.height = cropHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // White background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, cropWidth, cropHeight)

    const displaySize = containerSize.width
    const scale = cropWidth / displaySize

    // Calculate the actual displayed image dimensions
    const displayedWidth = image.width * zoom
    const displayedHeight = image.height * zoom

    // Scale for output canvas (1080x1080)
    const outputWidth = displayedWidth * scale
    const outputHeight = displayedHeight * scale

    // Calculate centered position with user offset
    const outputX = (cropWidth - outputWidth) / 2 + position.x * scale
    const outputY = (cropHeight - outputHeight) / 2 + position.y * scale

    ctx.drawImage(image, outputX, outputY, outputWidth, outputHeight)

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob)
        }
      },
      "image/jpeg",
      0.95,
    )
  }

  const previewStyle = image
    ? {
        width: `${image.width * zoom}px`,
        height: `${image.height * zoom}px`,
        transform: `translate(${position.x}px, ${position.y}px)`,
        objectFit: "contain" as const,
      }
    : {}

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/5 to-transparent">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Crop Image (1:1)</h2>
        <button
          onClick={handleApplyCrop}
          className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          Apply
        </button>
      </div>

      {/* Crop Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-800">
        <div
          ref={containerRef}
          className="relative overflow-hidden shadow-2xl rounded-lg"
          style={{
            width: `${containerSize.width}px`,
            height: `${containerSize.height}px`,
            backgroundImage: "repeating-conic-gradient(#e5e7eb 0% 25%, #f3f4f6 0% 50%)",
            backgroundPosition: "0 0, 10px 10px",
            backgroundSize: "20px 20px",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute inset-0 flex items-center justify-center cursor-move">
            {image && (
              <img
                ref={imageRef}
                src={imageUrl || "/placeholder.svg"}
                alt="Crop preview"
                className="absolute pointer-events-none select-none"
                style={previewStyle}
                draggable={false}
              />
            )}
          </div>

          {/* Grid overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full border-2 border-primary/70">
              <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-white/30" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 px-4 py-2 bg-white dark:bg-gray-900 rounded-full shadow-sm">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Output: 1080×1080 • Zoom: {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <button
          onClick={handleZoomOut}
          className="flex items-center justify-center w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="flex-1 max-w-xs">
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(Number.parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <button
          onClick={handleZoomIn}
          className="flex items-center justify-center w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          onClick={handleReset}
          className="flex items-center justify-center w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95"
          aria-label="Reset"
        >
          <RotateCcw className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  )
}
