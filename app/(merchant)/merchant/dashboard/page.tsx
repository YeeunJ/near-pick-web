import Link from 'next/link'
import { Calendar, ShoppingBag, TrendingUp, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/features/StatusBadge'
import { mockDashboard } from '@/lib/mock/users'
import { formatDateTime, formatPrice } from '@/lib/utils'

export default function MerchantDashboardPage() {
  const dash = mockDashboard

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

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs text-muted-foreground font-normal flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              대기 예약
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{dash.pendingReservationCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs text-muted-foreground font-normal flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4" />
              오늘 구매
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{dash.todayPurchaseCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs text-muted-foreground font-normal flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              인기점수
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{dash.totalPopularityScore}</p>
          </CardContent>
        </Card>
      </div>

      {/* 대기 예약 */}
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
                <StatusBadge status={r.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 내 상품 */}
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
