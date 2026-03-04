'use client'

import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { getMerchantReservations, confirmReservation } from '@/lib/api/merchant'
import { formatDateTime } from '@/lib/utils'
import type { ReservationItem, ReservationStatus } from '@/types/api'

const TABS: { value: ReservationStatus | 'ALL'; label: string }[] = [
  { value: 'PENDING', label: '대기중' },
  { value: 'CONFIRMED', label: '확정' },
  { value: 'ALL', label: '전체' },
]

export default function MerchantReservationsPage() {
  const [items, setItems] = useState<ReservationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMerchantReservations()
      .then(setItems)
      .finally(() => setLoading(false))
  }, [])

  async function handleConfirm(id: number) {
    const result = await confirmReservation(id)
    setItems((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: result.status } : r)),
    )
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-xl font-bold">예약 관리</h1>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : (
        <Tabs defaultValue="PENDING">
          <TabsList>
            {TABS.map((tab) => {
              const count = tab.value === 'ALL' ? items.length : items.filter((r) => r.status === tab.value).length
              return (
                <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
                  {tab.label}
                  <Badge variant="secondary" className="text-xs h-5 px-1.5">{count}</Badge>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {TABS.map((tab) => {
            const filtered = tab.value === 'ALL' ? items : items.filter((r) => r.status === tab.value)
            return (
              <TabsContent key={tab.value} value={tab.value} className="mt-4">
                {filtered.length === 0 ? (
                  <EmptyState icon={Calendar} title="예약이 없어요" />
                ) : (
                  <div className="space-y-3">
                    {filtered.map((r) => (
                      <div key={r.id} className="border border-border rounded-lg p-4 space-y-3 bg-card">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">{r.productTitle}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatDateTime(r.visitAt)} · {r.quantity}개
                            </p>
                            {r.memo && (
                              <p className="text-xs text-muted-foreground mt-0.5">메모: {r.memo}</p>
                            )}
                          </div>
                        </div>
                        {r.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-primary hover:bg-primary/90"
                              onClick={() => handleConfirm(r.id)}
                            >
                              확정
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">거절</Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      )}
    </div>
  )
}
