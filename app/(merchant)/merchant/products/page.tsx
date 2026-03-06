'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/features/StatusBadge'
import { getMerchantProducts, closeProduct } from '@/lib/api/merchant'
import { formatPrice } from '@/lib/utils'
import type { ProductListItem } from '@/types/api'

export default function MerchantProductsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMerchantProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  async function handleClose(id: number) {
    await closeProduct(id)
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'CLOSED' as const } : p)),
    )
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">상품 관리</h1>
        <Button asChild size="sm" className="gap-1.5 bg-primary hover:bg-primary/90">
          <Link href="/merchant/products/new">
            <Plus className="w-4 h-4" />
            상품 등록
          </Link>
        </Button>
      </div>

      {loading ? (
        <Skeleton className="h-48 rounded-xl" />
      ) : (
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>상품명</TableHead>
                <TableHead>가격</TableHead>
                <TableHead>유형</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium text-sm">{product.title}</TableCell>
                  <TableCell className="text-sm">{formatPrice(product.price)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {product.productType === 'RESERVATION' ? '예약' : '선착순'}
                  </TableCell>
                  <TableCell><StatusBadge status={product.status} /></TableCell>
                  <TableCell className="text-right">
                    {product.status === 'ACTIVE' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm">종료</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>상품 종료</DialogTitle>
                            <DialogDescription>
                              &quot;{product.title}&quot; 상품을 종료하시겠습니까?
                              종료 후에는 소비자에게 노출되지 않습니다.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="gap-2">
                            <Button variant="outline" className="flex-1">취소</Button>
                            <Button
                              variant="destructive"
                              className="flex-1"
                              onClick={() => handleClose(product.id)}
                            >
                              종료
                            </Button>
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
      )}
    </div>
  )
}
