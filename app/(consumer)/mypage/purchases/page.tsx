'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatusBadge } from '@/components/features/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { getFlashPurchases } from '@/lib/api/flashPurchases'
import { formatDateTime } from '@/lib/utils'
import type { FlashPurchaseItem } from '@/types/api'

export default function PurchasesPage() {
  const [items, setItems] = useState<FlashPurchaseItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFlashPurchases()
      .then(setItems)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col">
      <PageHeader title="구매 내역" showBack />
      {loading ? (
        <div className="p-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="구매 내역이 없어요" action={{ label: '선착순 상품 보기', href: '/' }} />
      ) : (
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="p-4 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-sm">{item.productTitle}</p>
                <StatusBadge status={item.status} />
              </div>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <p>구매일시: {formatDateTime(item.purchasedAt)}</p>
                <p>수량: {item.quantity}개</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
