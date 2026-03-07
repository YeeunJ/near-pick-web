import { api, extractList } from './client'
import type { CreateFlashPurchaseRequest, FlashPurchaseItem, PageResponse } from '@/types/api'

export function createFlashPurchase(body: CreateFlashPurchaseRequest): Promise<FlashPurchaseItem> {
  return api.post<FlashPurchaseItem>('/flash-purchases', body)
}

export function getFlashPurchases(): Promise<FlashPurchaseItem[]> {
  return api.get<PageResponse<FlashPurchaseItem> | FlashPurchaseItem[]>('/flash-purchases/me').then(extractList)
}
