'use client'

import { useRef, useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { uploadProductImage } from '@/lib/api/productImages'
import type { ProductImageResponse } from '@/types/api'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface ImageUploaderProps {
  productId: number
  currentCount: number
  onUploaded: (image: ProductImageResponse) => void
}

export function ImageUploader({ productId, currentCount, onUploaded }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isDisabled = uploading || currentCount >= 5

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('jpg, png, webp 파일만 업로드할 수 있습니다.')
      return
    }

    setError(null)
    setUploading(true)
    try {
      const image = await uploadProductImage(productId, file, currentCount)
      onUploaded(image)
    } catch {
      setError('이미지 업로드에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={isDisabled}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isDisabled}
        className="flex items-center justify-center w-full h-20 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Plus className="w-5 h-5" />
            <span className="text-xs">이미지 추가 ({currentCount}/5)</span>
          </div>
        )}
      </button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
