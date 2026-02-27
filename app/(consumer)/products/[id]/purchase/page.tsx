'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, AlertTriangle } from 'lucide-react'
import { mockFlashProductDetail } from '@/lib/mock/products'
import { formatPrice } from '@/lib/utils'

export default function PurchasePage({ params }: { params: { id: string } }) {
  const product = mockFlashProductDetail
  const [quantity, setQuantity] = useState('1')
  const qty = parseInt(quantity)
  const QUANTITY_OPTIONS = Array.from(
    { length: Math.min(product.remainingQuantity ?? 5, 10) },
    (_, i) => i + 1,
  )

  return (
    <div className="flex flex-col">
      <PageHeader title="선착순 구매" showBack />
      <div className="p-4 space-y-5">
        {/* 상품 요약 */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <p className="font-semibold">{product.title}</p>
            <p className="text-primary font-bold">{formatPrice(product.price)}</p>
            {product.remainingQuantity !== undefined && (
              <Badge variant="destructive" className="gap-1">
                <Zap className="w-3 h-3" />
                남은 수량: {product.remainingQuantity}개
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* 수량 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">수량</label>
          <Select value={quantity} onValueChange={setQuantity}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUANTITY_OPTIONS.map((q) => (
                <SelectItem key={q} value={String(q)}>
                  {q}개
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* 총 금액 */}
        <div className="flex justify-between font-semibold">
          <span>총 금액</span>
          <span className="text-primary text-lg">{formatPrice(product.price * qty)}</span>
        </div>

        {/* 경고 문구 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-lg p-3">
          <AlertTriangle className="w-4 h-4 shrink-0 text-destructive" />
          <span>구매 후 취소 불가합니다. 신중하게 확인 후 구매하세요.</span>
        </div>

        {/* 구매 확인 Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
              <Zap className="w-4 h-4" />
              선착순 구매하기
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>구매 확인</DialogTitle>
              <DialogDescription>
                {product.title} {qty}개를 {formatPrice(product.price * qty)}에 구매하시겠습니까?
                <br />
                구매 후 취소가 불가능합니다.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" className="flex-1">
                취소
              </Button>
              <Button className="flex-1 bg-primary hover:bg-primary/90">구매</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
