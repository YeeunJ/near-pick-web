'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, ImagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { createProduct } from '@/lib/api/merchant'
import { uploadProductImage } from '@/lib/api/productImages'
import { cn } from '@/lib/utils'
import type { ProductCategory, ProductSpecItem, ProductType } from '@/types/api'

const PRODUCT_TYPES: { type: ProductType; label: string; description: string }[] = [
  { type: 'RESERVATION', label: '예약 상품', description: '소비자가 방문 일정을 잡고 예약하는 상품' },
  { type: 'FLASH_SALE', label: '선착순 구매 상품', description: '수량 한정, 선착순으로 즉시 구매하는 상품' },
]

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'FOOD', label: '음식' },
  { value: 'BEVERAGE', label: '음료' },
  { value: 'BEAUTY', label: '뷰티' },
  { value: 'DAILY', label: '생활용품' },
  { value: 'OTHER', label: '기타' },
]

const SPEC_CATEGORIES: ProductCategory[] = ['BEAUTY', 'DAILY', 'OTHER']

export default function NewProductPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [productType, setProductType] = useState<ProductType>('RESERVATION')
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [stock, setStock] = useState('')
  const [availableUntil, setAvailableUntil] = useState('')
  const [category, setCategory] = useState<ProductCategory | null>(null)
  const [specs, setSpecs] = useState<ProductSpecItem[]>([])
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function addSpec() {
    setSpecs((prev) => [...prev, { key: '', value: '' }])
  }

  function updateSpec(index: number, field: 'key' | 'value', val: string) {
    setSpecs((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: val } : s)))
  }

  function removeSpec(index: number) {
    setSpecs((prev) => prev.filter((_, i) => i !== index))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    const remaining = 5 - pendingFiles.length
    const toAdd = files.slice(0, remaining)

    setPendingFiles((prev) => [...prev, ...toAdd])
    toAdd.forEach((file) => {
      const url = URL.createObjectURL(file)
      setPendingPreviews((prev) => [...prev, url])
    })

    // reset input so same file can be re-selected
    e.target.value = ''
  }

  function removeFile(index: number) {
    URL.revokeObjectURL(pendingPreviews[index])
    setPendingFiles((prev) => prev.filter((_, i) => i !== index))
    setPendingPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const result = await createProduct({
        title,
        description,
        price: Number(price),
        productType,
        stock: Number(stock),
        availableUntil: availableUntil ? `${availableUntil}:00` : undefined,
        category: category ?? undefined,
        specs: specs.filter((s) => s.key && s.value).length > 0
          ? specs.filter((s) => s.key && s.value)
          : undefined,
      })

      if (result?.id && pendingFiles.length > 0) {
        await Promise.all(
          pendingFiles.map((file, i) => uploadProductImage(result.id, file, i + 1))
        )
      }

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
            <CardTitle className="text-base">카테고리 (선택)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCategory(category === value ? null : value)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm border transition-colors',
                    category === value
                      ? 'bg-primary text-white border-primary'
                      : 'bg-card border-border hover:bg-muted',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {category && SPEC_CATEGORIES.includes(category) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">상품 정보 (스펙)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {specs.map((spec, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder="항목 (예: 용량)"
                    value={spec.key}
                    onChange={(e) => updateSpec(i, 'key', e.target.value)}
                  />
                  <Input
                    placeholder="값 (예: 200ml)"
                    value={spec.value}
                    onChange={(e) => updateSpec(i, 'value', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSpec(i)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addSpec}
                className="w-full text-sm"
              >
                + 항목 추가
              </Button>
            </CardContent>
          </Card>
        )}

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

        <Card>
          <CardHeader>
            <CardTitle className="text-base">상품 이미지 (선택, 최대 5장)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingPreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {pendingPreviews.map((src, i) => (
                  <div key={i} className="relative aspect-square">
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {pendingFiles.length < 5 && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="w-4 h-4 mr-2" />
                  이미지 추가 ({pendingFiles.length}/5)
                </Button>
              </>
            )}
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
