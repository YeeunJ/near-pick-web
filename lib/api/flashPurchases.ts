import { api } from './client'
import type { CreateFlashPurchaseRequest, FlashPurchaseItem } from '@/types/api'

export function createFlashPurchase(body: CreateFlashPurchaseRequest): Promise<FlashPurchaseItem> {
  return api.post<FlashPurchaseItem>('/flash-purchases', body)
}

export function getFlashPurchases(): Promise<FlashPurchaseItem[]> {
  return api.get<FlashPurchaseItem[]>('/flash-purchases')
}
