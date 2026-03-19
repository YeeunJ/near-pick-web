'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { getProductDetail } from '@/lib/api/products'
import { createReservation } from '@/lib/api/reservations'
import { formatPrice } from '@/lib/utils'
import type { ProductDetailResponse } from '@/types/api'

const QUANTITY_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1)

export default function ReservePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [product, setProduct] = useState<ProductDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [visitDate, setVisitDate] = useState('')
  const [visitTime, setVisitTime] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [memo, setMemo] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getProductDetail(Number(id))
      .then(setProduct)
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!product) return
    setSubmitting(true)
    setError(null)
    try {
      await createReservation({
        productId: product.id,
        visitScheduledAt: `${visitDate}T${visitTime}:00`,
        quantity: Number(quantity),
        memo: memo || undefined,
      })
      router.refresh()
      router.push('/mypage/reservations')
    } catch {
      setError('예약에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  const qty = Number(quantity)

  return (
    <div className="flex flex-col">
      <PageHeader title="예약하기" showBack />
      <div className="p-4 space-y-5">
        {loading ? (
          <Skeleton className="h-20 rounded-xl" />
        ) : product ? (
          <Card>
            <CardContent className="p-4">
              <p className="font-semibold">{product.title}</p>
              <p className="text-primary font-bold mt-1">{formatPrice(product.price)}</p>
            </CardContent>
          </Card>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="visitDate">방문 날짜</Label>
            <Input
              id="visitDate"
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="visitTime">방문 시간</Label>
            <Input
              id="visitTime"
              type="time"
              value={visitTime}
              onChange={(e) => setVisitTime(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>수량</Label>
            <Select value={quantity} onValueChange={setQuantity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {QUANTITY_OPTIONS.map((q) => (
                  <SelectItem key={q} value={String(q)}>
                    {q}개 {product && `(${formatPrice(product.price * q)})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="memo">요청 사항 (선택)</Label>
            <Textarea
              id="memo"
              placeholder="가게에 전달할 내용을 입력하세요"
              rows={3}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>

          <Separator />

          <div className="flex justify-between font-semibold">
            <span>총 금액</span>
            <span className="text-primary text-lg">
              {product ? formatPrice(product.price * qty) : '-'}
            </span>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={submitting || loading}
          >
            {submitting ? '처리 중...' : '예약 확정'}
          </Button>
        </form>
      </div>
    </div>
  )
}
