import Link from 'next/link'
import { MapPin, Heart, Calendar, Zap, Star, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatusBadge } from '@/components/features/StatusBadge'
import { mockProductDetail, mockFlashProductDetail } from '@/lib/mock/products'
import { formatPrice } from '@/lib/utils'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const isFlash = params.id === '2' || params.id === '4'
  const product = isFlash ? mockFlashProductDetail : mockProductDetail

  return (
    <div className="flex flex-col">
      <PageHeader title="상품 상세" showBack />

      {/* 이미지 placeholder */}
      <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground text-sm">
        이미지
      </div>

      <div className="p-4 space-y-4">
        {/* 상품 기본 정보 */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-lg font-bold leading-tight">{product.title}</h1>
            <StatusBadge status={product.status} />
          </div>
          <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{product.shopAddress}</span>
          </div>
          {product.distanceKm !== undefined && (
            <p className="text-sm text-muted-foreground">{product.distanceKm.toFixed(1)}km 거리</p>
          )}
        </div>

        <Separator />

        {/* 인기 지표 */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Heart className="w-4 h-4" />
            <span>{product.wishlistCount}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{product.reservationCount}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <ShoppingBag className="w-4 h-4" />
            <span>{product.purchaseCount}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground ml-auto">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{product.popularityScore}</span>
          </div>
        </div>

        {/* FLASH 잔여 수량 */}
        {product.productType === 'FLASH_SALE' && product.remainingQuantity !== undefined && (
          <Badge variant="destructive" className="gap-1">
            <Zap className="w-3 h-3" />
            남은 수량: {product.remainingQuantity}개
          </Badge>
        )}

        <Separator />

        {/* 상품 설명 */}
        <div className="space-y-2">
          <h2 className="font-semibold text-sm">상품 설명</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
        </div>

        {/* 액션 버튼 */}
        <div className="space-y-2 pt-2">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 gap-2">
              <Heart className="w-4 h-4" />
              찜하기
            </Button>
            {product.productType === 'GENERAL' && (
              <Button variant="outline" className="flex-1 gap-2" asChild>
                <Link href={`/products/${product.id}/reserve`}>
                  <Calendar className="w-4 h-4" />
                  예약하기
                </Link>
              </Button>
            )}
          </div>
          {product.productType === 'FLASH_SALE' && (
            <Button className="w-full gap-2 bg-primary hover:bg-primary/90" asChild>
              <Link href={`/products/${product.id}/purchase`}>
                <Zap className="w-4 h-4" />
                선착순 구매
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
