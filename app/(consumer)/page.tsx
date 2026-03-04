'use client'

import { useEffect, useState } from 'react'
import { ConsumerHeader } from '@/components/layout/ConsumerHeader'
import { ProductCard } from '@/components/features/product/ProductCard'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { getNearbyProducts } from '@/lib/api/products'
import { useGeolocation } from '@/lib/hooks/useGeolocation'
import type { ProductSummaryResponse } from '@/types/api'
import { MapPin } from 'lucide-react'

const RADIUS_OPTIONS = [
  { label: '0.5km', value: 0.5 },
  { label: '1km', value: 1 },
  { label: '2km', value: 2 },
  { label: '5km', value: 5 },
]

export default function ConsumerHomePage() {
  const { lat, lng, loading: geoLoading } = useGeolocation()
  const [radius, setRadius] = useState(1)
  const [products, setProducts] = useState<ProductSummaryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (geoLoading) return
    setLoading(true)
    setError(null)
    getNearbyProducts(lat, lng, radius)
      .then(setProducts)
      .catch(() => setError('상품을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [lat, lng, radius, geoLoading])

  return (
    <>
      <ConsumerHeader />
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center gap-2">
          <Select
            value={String(radius)}
            onValueChange={(v) => setRadius(Number(v))}
          >
            <SelectTrigger className="w-28 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RADIUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={String(o.value)}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Tabs defaultValue="popular" className="flex-1">
            <TabsList className="h-9 w-full">
              <TabsTrigger value="popular" className="flex-1 text-sm">인기순</TabsTrigger>
              <TabsTrigger value="distance" className="flex-1 text-sm">거리순</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <EmptyState icon={MapPin} title="상품을 불러오지 못했습니다." description={error} />
        ) : products.length === 0 ? (
          <EmptyState icon={MapPin} title="근처 상품이 없습니다." description="반경을 넓혀보세요." />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Button variant="outline" className="w-full">더 보기</Button>
          </>
        )}
      </div>
    </>
  )
}
