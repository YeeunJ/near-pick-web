'use client'

import { useEffect, useState } from 'react'
import { Heart, MapPin, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatusBadge } from '@/components/features/StatusBadge'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getWishlist, removeWishlist } from '@/lib/api/wishlist'
import { formatPrice } from '@/lib/utils'
import type { WishlistItem } from '@/types/api'

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getWishlist()
      .then(setItems)
      .finally(() => setLoading(false))
  }, [])

  async function handleRemove(productId: number) {
    await removeWishlist(productId)
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  return (
    <div className="flex flex-col">
      <PageHeader title="찜 목록" showBack />
      {loading ? (
        <div className="divide-y divide-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <Skeleton className="w-16 h-16 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="찜한 상품이 없어요"
          description="마음에 드는 상품을 찜해보세요"
          action={{ label: '상품 둘러보기', href: '/' }}
        />
      ) : (
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.wishlistId} className="flex items-center gap-3 p-4">
              <div className="w-16 h-16 bg-muted rounded-lg shrink-0 flex items-center justify-center text-xs text-muted-foreground">
                이미지
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-1">{item.productTitle}</p>
                <p className="text-primary font-bold text-sm mt-0.5">{formatPrice(item.productPrice)}</p>
                {item.shopAddress && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{item.shopAddress}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {item.productType === 'FLASH_SALE' && (
                  <Badge variant="destructive" className="text-xs px-1.5 py-0.5">선착순</Badge>
                )}
                {item.productType === 'RESERVATION' && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5 text-primary border-primary">예약</Badge>
                )}
                <StatusBadge status={item.productStatus} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemove(item.productId)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
