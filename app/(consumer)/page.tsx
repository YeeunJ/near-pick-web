'use client'

import { useEffect, useState } from 'react'
import { MapPin, Navigation } from 'lucide-react'
import { ConsumerHeader } from '@/components/layout/ConsumerHeader'
import { ProductCard } from '@/components/features/product/ProductCard'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { getNearbyProducts } from '@/lib/api/products'
import { getWishlist } from '@/lib/api/wishlist'
import { getSavedLocations, updateCurrentLocation } from '@/lib/api/location'
import { useLocationStore } from '@/lib/store/locationStore'
import { useAuthStore } from '@/lib/store/authStore'
import { cn } from '@/lib/utils'
import type { ProductCategory, ProductSummaryResponse, SavedLocationResponse, SortType } from '@/types/api'

const RADIUS_OPTIONS = [
  { label: '0.5km', value: 0.5 },
  { label: '1km', value: 1 },
  { label: '2km', value: 2 },
  { label: '5km', value: 5 },
]

const CATEGORY_TABS: { value: ProductCategory | null; label: string }[] = [
  { value: null, label: '전체' },
  { value: 'FOOD', label: '음식' },
  { value: 'BEVERAGE', label: '음료' },
  { value: 'BEAUTY', label: '뷰티' },
  { value: 'DAILY', label: '생활' },
]

export default function ConsumerHomePage() {
  const { location, locationSource, savedLocationId, setGpsLocation, setLocationSource } = useLocationStore()
  const { role } = useAuthStore()
  const [radius, setRadius] = useState(1)
  const [sort, setSort] = useState<SortType>('POPULARITY')
  const [category, setCategory] = useState<ProductCategory | null>(null)
  const [products, setProducts] = useState<ProductSummaryResponse[]>([])
  const [wishlistedIds, setWishlistedIds] = useState<Set<number>>(new Set())
  const [savedLocations, setSavedLocations] = useState<SavedLocationResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 저장 위치 목록 로드 (CONSUMER 로그인 시)
  useEffect(() => {
    if (role === 'CONSUMER') {
      getSavedLocations().catch(() => []).then(setSavedLocations)
    }
  }, [role])

  useEffect(() => {
    setLoading(true)
    setError(null)

    const params = {
      radius,
      sort,
      locationSource,
      ...(locationSource === 'DIRECT' ? { lat: location.lat, lng: location.lng } : {}),
      ...(locationSource === 'SAVED' && savedLocationId ? { savedLocationId } : {}),
      ...(category ? { category } : {}),
    }

    Promise.all([
      getNearbyProducts(params),
      getWishlist().catch(() => []),
    ])
      .then(([prods, wishlist]) => {
        setProducts(prods)
        setWishlistedIds(new Set(wishlist.map((w) => w.productId)))
      })
      .catch(() => setError('상품을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [location.lat, location.lng, radius, sort, locationSource, savedLocationId, category])

  function handleWishlistChange(productId: number, wishlisted: boolean) {
    setWishlistedIds((prev) => {
      const next = new Set(prev)
      if (wishlisted) next.add(productId)
      else next.delete(productId)
      return next
    })
  }

  async function handleSelectCurrent() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords
      try {
        if (role === 'CONSUMER') {
          await updateCurrentLocation(lat, lng)
        }
      } catch { /* 비로그인 또는 실패 시 무시 */ }
      setGpsLocation(lat, lng)
    })
  }

  function handleSelectSaved(value: string) {
    const id = Number(value)
    const loc = savedLocations.find((l) => l.id === id)
    if (!loc) return
    setLocationSource('SAVED', id)
  }

  return (
    <>
      <ConsumerHeader />
      <div className="px-4 py-4 space-y-3">
        {/* locationSource 선택 */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setLocationSource('DIRECT')}
            className={cn(
              'flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full text-xs border transition-colors',
              locationSource === 'DIRECT'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-border text-muted-foreground hover:bg-muted',
            )}
          >
            <MapPin className="w-3.5 h-3.5" />
            {location.displayName}
          </button>
          <button
            onClick={handleSelectCurrent}
            className={cn(
              'flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full text-xs border transition-colors',
              locationSource === 'CURRENT'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-border text-muted-foreground hover:bg-muted',
            )}
          >
            <Navigation className="w-3.5 h-3.5" />
            현재위치
          </button>
          {role === 'CONSUMER' && savedLocations.length > 0 && (
            <Select
              value={locationSource === 'SAVED' && savedLocationId ? String(savedLocationId) : ''}
              onValueChange={handleSelectSaved}
            >
              <SelectTrigger
                className={cn(
                  'h-8 text-xs shrink-0 w-28 rounded-full',
                  locationSource === 'SAVED' ? 'border-primary text-primary' : '',
                )}
              >
                <SelectValue placeholder="저장 위치" />
              </SelectTrigger>
              <SelectContent>
                {savedLocations.map((loc) => (
                  <SelectItem key={loc.id} value={String(loc.id)}>
                    {loc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* category 필터 */}
        <Tabs
          value={category ?? 'ALL'}
          onValueChange={(v) => setCategory(v === 'ALL' ? null : (v as ProductCategory))}
        >
          <TabsList className="h-8 w-full">
            {CATEGORY_TABS.map((t) => (
              <TabsTrigger
                key={String(t.value)}
                value={t.value ?? 'ALL'}
                className="flex-1 text-xs"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* 반경 + 정렬 */}
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
          <Tabs
            value={sort}
            onValueChange={(v) => setSort(v as SortType)}
            className="flex-1"
          >
            <TabsList className="h-9 w-full">
              <TabsTrigger value="POPULARITY" className="flex-1 text-sm">인기순</TabsTrigger>
              <TabsTrigger value="DISTANCE" className="flex-1 text-sm">거리순</TabsTrigger>
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
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistedIds.has(product.id)}
                  onWishlistChange={handleWishlistChange}
                />
              ))}
            </div>
            <Button variant="outline" className="w-full">더 보기</Button>
          </>
        )}
      </div>
    </>
  )
}
