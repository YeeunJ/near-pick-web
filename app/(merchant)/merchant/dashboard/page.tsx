'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, ShoppingBag, TrendingUp, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/features/StatusBadge'
import { getMerchantDashboard, confirmReservation } from '@/lib/api/merchant'
import { formatDateTime, formatPrice } from '@/lib/utils'
import type { MerchantDashboardResponse } from '@/types/api'

export default function MerchantDashboardPage() {
  const [dash, setDash] = useState<MerchantDashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMerchantDashboard()
      .then(setDash)
      .finally(() => setLoading(false))
  }, [])

  async function handleConfirm(id: number) {
    const result = await confirmReservation(id)
    setDash((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        recentReservations: prev.recentReservations.map((r) =>
          r.id === id ? { ...r, status: result.status } : r,
        ),
      }
    })
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (!dash) return null

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">안녕하세요, {dash.shopName}!</h1>
        <Button asChild size="sm" className="gap-1.5 bg-primary hover:bg-primary/90">
          <Link href="/merchant/products/new">
            <Plus className="w-4 h-4" />
            상품 등록
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Calendar, label: '대기 예약', value: dash.pendingReservationCount },
          { icon: ShoppingBag, label: '오늘 구매', value: dash.todayPurchaseCount },
          { icon: TrendingUp, label: '인기점수', value: dash.totalPopularityScore },
        ].map(({ icon: Icon, label, value }) => (
          <Card key={label}>
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs text-muted-foreground font-normal flex items-center gap-1.5">
                <Icon className="w-4 h-4" />
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {dash.recentReservations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">대기 중인 예약</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dash.recentReservations.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{r.productTitle}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDateTime(r.visitAt)} · {r.quantity}개
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={r.status} />
                  {r.status === 'PENDING' && (
                    <Button size="sm" className="bg-primary hover:bg-primary/90 h-7 text-xs" onClick={() => handleConfirm(r.id)}>
                      확정
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">내 상품</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/merchant/products" className="text-xs text-primary">전체 보기</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {dash.myProducts.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium">{p.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{formatPrice(p.price)}</p>
              </div>
              <StatusBadge status={p.status} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
