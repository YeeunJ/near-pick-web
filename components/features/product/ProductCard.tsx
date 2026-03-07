'use client'

import Link from 'next/link'
import { Heart, MapPin, Star, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { addWishlist, removeWishlist } from '@/lib/api/wishlist'
import type { ProductSummaryResponse } from '@/types/api'

interface ProductCardProps {
  product: ProductSummaryResponse
  isWishlisted?: boolean
  onWishlistChange?: (productId: number, wishlisted: boolean) => void
}

export function ProductCard({ product, isWishlisted = false, onWishlistChange }: ProductCardProps) {
  async function handleHeart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    try {
      if (isWishlisted) {
        await removeWishlist(product.id)
        onWishlistChange?.(product.id, false)
      } else {
        await addWishlist(product.id)
        onWishlistChange?.(product.id, true)
      }
    } catch {
      // 로그인 필요 등 에러는 무시 (상세 페이지에서 처리)
    }
  }

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div className="relative aspect-square bg-gray-100 flex items-center justify-center text-gray-300 text-sm">
          이미지
          <button
            onClick={handleHeart}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
              }`}
            />
          </button>
        </div>
        <CardContent className="p-3 space-y-1">
          <div className="flex items-start justify-between gap-1">
            <p className="font-medium text-sm line-clamp-2 leading-tight">{product.title}</p>
            {product.productType === 'FLASH_SALE' && (
              <Badge variant="destructive" className="shrink-0 text-xs px-1.5 py-0.5">
                <Zap className="w-3 h-3 mr-0.5" />
                FLASH
              </Badge>
            )}
          </div>

          <p className="font-bold text-primary">{formatPrice(product.price)}</p>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{product.shopAddress ?? product.merchantName}</span>
            <span className="shrink-0 ml-auto">{product.distanceKm.toFixed(1)}km</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{product.popularityScore}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
