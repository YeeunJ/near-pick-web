'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { ProductType } from '@/types/api'

export default function NewProductPage() {
  const [productType, setProductType] = useState<ProductType>('GENERAL')

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-bold">상품 등록</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 상품 유형 */}
          <div className="space-y-2">
            <Label>상품 유형</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['GENERAL', 'FLASH_SALE'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setProductType(type)}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    productType === type
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border text-foreground hover:bg-muted'
                  }`}
                >
                  {type === 'GENERAL' ? '일반 상품' : '선착순 상품'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">상품명</Label>
            <Input id="title" placeholder="ex) 아메리카노 당일 할인" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">가격 (원)</Label>
            <Input id="price" type="number" placeholder="2500" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">상품 설명</Label>
            <Textarea id="description" placeholder="상품에 대한 자세한 설명을 입력하세요" rows={4} />
          </div>
        </CardContent>
      </Card>

      {/* 선착순 전용 정보 */}
      {productType === 'FLASH_SALE' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">선착순 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">수량</Label>
              <Input id="quantity" type="number" placeholder="10" min={1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endsAt">종료 일시</Label>
              <Input id="endsAt" type="datetime-local" />
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />
      <Button className="w-full bg-primary hover:bg-primary/90">등록하기</Button>
    </div>
  )
}
