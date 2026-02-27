import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { mockProductDetail } from '@/lib/mock/products'
import { formatPrice } from '@/lib/utils'

export default function ReservePage({ params }: { params: { id: string } }) {
  const product = mockProductDetail
  const QUANTITY_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <div className="flex flex-col">
      <PageHeader title="예약하기" showBack />
      <div className="p-4 space-y-5">
        {/* 상품 요약 */}
        <Card>
          <CardContent className="p-4">
            <p className="font-semibold">{product.title}</p>
            <p className="text-primary font-bold mt-1">{formatPrice(product.price)}</p>
          </CardContent>
        </Card>

        {/* 방문 날짜 */}
        <div className="space-y-2">
          <Label htmlFor="visitDate">방문 날짜</Label>
          <Input id="visitDate" type="date" />
        </div>

        {/* 방문 시간 */}
        <div className="space-y-2">
          <Label htmlFor="visitTime">방문 시간</Label>
          <Input id="visitTime" type="time" />
        </div>

        {/* 수량 */}
        <div className="space-y-2">
          <Label>수량</Label>
          <Select defaultValue="1">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUANTITY_OPTIONS.map((q) => (
                <SelectItem key={q} value={String(q)}>
                  {q}개 ({formatPrice(product.price * q)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 요청 사항 */}
        <div className="space-y-2">
          <Label htmlFor="memo">요청 사항 (선택)</Label>
          <Textarea id="memo" placeholder="가게에 전달할 내용을 입력하세요" rows={3} />
        </div>

        <Separator />

        {/* 총 금액 */}
        <div className="flex justify-between font-semibold">
          <span>총 금액</span>
          <span className="text-primary text-lg">{formatPrice(product.price)}</span>
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90">예약 확정</Button>
      </div>
    </div>
  )
}
