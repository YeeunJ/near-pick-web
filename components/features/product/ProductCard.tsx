import Link from 'next/link'
import { MapPin, Star, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import type { ProductSummaryResponse } from '@/types/api'

interface ProductCardProps {
  product: ProductSummaryResponse
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-300 text-sm">
          이미지
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
