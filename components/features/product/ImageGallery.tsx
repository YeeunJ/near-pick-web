'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ProductImageResponse } from '@/types/api'

interface ImageGalleryProps {
  images: ProductImageResponse[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-video w-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
        이미지 없음
      </div>
    )
  }

  function prev() {
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }

  function next() {
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-muted">
      <div
        className="flex h-full transition-transform duration-300"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt=""
            className="w-full h-full object-cover shrink-0"
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
