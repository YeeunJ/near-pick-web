import { api } from './client'
import type { ProductSummaryResponse, UserSummary } from '@/types/api'

export function getAdminUsers(): Promise<UserSummary[]> {
  return api.get<UserSummary[]>('/admin/users')
}

export function suspendUser(id: number): Promise<void> {
  return api.patch<void>(`/admin/users/${id}/suspend`)
}

export function deleteUser(id: number): Promise<void> {
  return api.delete<void>(`/admin/users/${id}`)
}

export function getAdminProducts(): Promise<ProductSummaryResponse[]> {
  return api.get<ProductSummaryResponse[]>('/admin/products')
}

export function forceCloseProduct(id: number): Promise<void> {
  return api.patch<void>(`/admin/products/${id}/force-close`)
}
