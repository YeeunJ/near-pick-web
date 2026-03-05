import { api } from './client'
import type { AdminProductItem, PageResponse, UserSummary } from '@/types/api'

export function getAdminUsers(): Promise<UserSummary[]> {
  return api.get<PageResponse<UserSummary>>('/admin/users').then((r) => r.content)
}

export function suspendUser(id: number): Promise<void> {
  return api.patch<void>(`/admin/users/${id}/suspend`)
}

export function deleteUser(id: number): Promise<void> {
  return api.delete<void>(`/admin/users/${id}`)
}

export function getAdminProducts(): Promise<AdminProductItem[]> {
  return api.get<PageResponse<AdminProductItem>>('/admin/products').then((r) => r.content)
}

export function forceCloseProduct(id: number): Promise<void> {
  return api.patch<void>(`/admin/products/${id}/force-close`)
}
