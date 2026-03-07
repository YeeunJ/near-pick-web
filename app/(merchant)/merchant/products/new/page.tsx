'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { createProduct } from '@/lib/api/merchant'
import type { ProductType } from '@/types/api'

const PRODUCT_TYPES: { type: ProductType; label: string; description: string }[] = [
  { type: 'RESERVATION', label: '예약 상품', description: '소비자가 방문 일정을 잡고 예약하는 상품' },
  { type: 'FLASH_SALE', label: '선착순 구매 상품', description: '수량 한정, 선착순으로 즉시 구매하는 상품' },
]

export default function NewProductPage() {
  const router = useRouter()
  const [productType, setProductType] = useState<ProductType>('RESERVATION')
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [stock, setStock] = useState('')
  const [availableUntil, setAvailableUntil] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await createProduct({
        title,
        description,
        price: Number(price),
        productType,
        stock: Number(stock),
        availableUntil: availableUntil ? `${availableUntil}:00` : undefined,
      })
      router.push('/merchant/products')
    } catch {
      setError('상품 등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-bold">상품 등록</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">상품 유형</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {PRODUCT_TYPES.map(({ type, label, description: desc }) => (
              <button
                key={type}
                type="button"
                onClick={() => setProductType(type)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                  productType === type
                    ? 'bg-primary/5 border-primary'
                    : 'bg-card border-border hover:bg-muted'
                }`}
              >
                <p className={`text-sm font-semibold ${productType === type ? 'text-primary' : 'text-foreground'}`}>
                  {label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">상품명</Label>
              <Input
                id="title"
                placeholder="ex) 아메리카노 당일 할인"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">가격 (원)</Label>
              <Input
                id="price"
                type="number"
                placeholder="2500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">상품 설명</Label>
              <Textarea
                id="description"
                placeholder="상품에 대한 자세한 설명을 입력하세요"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {productType === 'RESERVATION' ? '예약 설정' : '선착순 설정'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stock">수량</Label>
              <Input
                id="stock"
                type="number"
                placeholder="10"
                min={1}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableUntil">
                {productType === 'RESERVATION' ? '예약 마감 일시' : '판매 종료 일시'}
              </Label>
              <Input
                id="availableUntil"
                type="datetime-local"
                value={availableUntil}
                onChange={(e) => setAvailableUntil(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive">{error}</p>}
        <Separator />
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={submitting}
        >
          {submitting ? '처리 중...' : '등록하기'}
        </Button>
      </form>
    </div>
  )
}
