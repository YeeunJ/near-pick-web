import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { StatusBadge } from '@/components/features/StatusBadge'
import { mockProducts } from '@/lib/mock/products'
import { formatPrice } from '@/lib/utils'
import type { ProductStatus } from '@/types/api'

const TABS: { value: ProductStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'ACTIVE', label: '판매중' },
  { value: 'CLOSED', label: '종료' },
]

export default function AdminProductsPage() {
  return (
    <div className="space-y-4 max-w-4xl">
      <h1 className="text-xl font-bold">상품 검수</h1>

      <Tabs defaultValue="ALL">
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => {
          const items =
            tab.value === 'ALL'
              ? mockProducts
              : mockProducts.filter((p) => p.status === tab.value)
          return (
            <TabsContent key={tab.value} value={tab.value} className="mt-4">
              <div className="border border-border rounded-lg overflow-hidden bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>상품명</TableHead>
                      <TableHead>가게 주소</TableHead>
                      <TableHead>가격</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead className="text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium text-sm">{product.title}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                          {product.shopAddress}
                        </TableCell>
                        <TableCell className="text-sm">{formatPrice(product.price)}</TableCell>
                        <TableCell>
                          <StatusBadge status={product.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          {product.status === 'ACTIVE' && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="destructive" size="sm">강제종료</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>상품 강제 종료</DialogTitle>
                                  <DialogDescription>
                                    &quot;{product.title}&quot; 상품을 강제 종료하시겠습니까?
                                    판매가 즉시 중단됩니다.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="gap-2">
                                  <Button variant="outline" className="flex-1">취소</Button>
                                  <Button variant="destructive" className="flex-1">강제종료</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
