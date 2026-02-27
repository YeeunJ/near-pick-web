import { ConsumerHeader } from '@/components/layout/ConsumerHeader'
import { ProductCard } from '@/components/features/product/ProductCard'
import { mockProducts } from '@/lib/mock/products'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ConsumerHomePage() {
  return (
    <>
      <ConsumerHeader />
      <div className="px-4 py-4 space-y-4">
        {/* 필터 바 */}
        <div className="flex items-center gap-2">
          <Select defaultValue="1km">
            <SelectTrigger className="w-28 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5km">0.5km</SelectItem>
              <SelectItem value="1km">1km</SelectItem>
              <SelectItem value="2km">2km</SelectItem>
              <SelectItem value="5km">5km</SelectItem>
            </SelectContent>
          </Select>
          <Tabs defaultValue="popular" className="flex-1">
            <TabsList className="h-9 w-full">
              <TabsTrigger value="popular" className="flex-1 text-sm">
                인기순
              </TabsTrigger>
              <TabsTrigger value="distance" className="flex-1 text-sm">
                거리순
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 상품 그리드 */}
        <div className="grid grid-cols-2 gap-3">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* 더 보기 */}
        <Button variant="outline" className="w-full">
          더 보기
        </Button>
      </div>
    </>
  )
}
