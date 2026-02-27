import { Calendar } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatusBadge } from '@/components/features/StatusBadge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockReservations } from '@/lib/mock/reservations'
import { formatDateTime, formatPrice } from '@/lib/utils'
import type { ReservationStatus } from '@/types/api'

const TABS: { value: ReservationStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'PENDING', label: '대기중' },
  { value: 'CONFIRMED', label: '확정' },
  { value: 'CANCELLED', label: '취소' },
]

export default function ReservationsPage() {
  return (
    <div className="flex flex-col">
      <PageHeader title="예약 내역" showBack />
      <Tabs defaultValue="ALL" className="flex-1">
        <TabsList className="w-full rounded-none border-b border-border bg-card h-10">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex-1 text-xs">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => {
          const items =
            tab.value === 'ALL'
              ? mockReservations
              : mockReservations.filter((r) => r.status === tab.value)
          return (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              {items.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="예약 내역이 없어요"
                  action={{ label: '상품 둘러보기', href: '/' }}
                />
              ) : (
                <ul className="divide-y divide-border">
                  {items.map((item) => (
                    <li key={item.id} className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm">{item.productTitle}</p>
                        <StatusBadge status={item.status} />
                      </div>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <p>방문일시: {formatDateTime(item.visitAt)}</p>
                        <p>수량: {item.quantity}개</p>
                        {item.memo && <p>메모: {item.memo}</p>}
                      </div>
                      {item.status === 'PENDING' && (
                        <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/5">
                          예약 취소
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
