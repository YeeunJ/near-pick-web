import { api } from './client'
import type { CreateFlashPurchaseRequest, FlashPurchaseItem, PageResponse } from '@/types/api'

export function createFlashPurchase(body: CreateFlashPurchaseRequest): Promise<FlashPurchaseItem> {
  return api.post<FlashPurchaseItem>('/flash-purchases', body)
}

export function getFlashPurchases(): Promise<FlashPurchaseItem[]> {
  return api.get<PageResponse<FlashPurchaseItem>>('/flash-purchases/me').then((r) => r.content)
}
