import { api, extractList } from './client'
import type { AdminProductItem, PageResponse, ProductStatus, UserRole, UserStatus, UserSummary } from '@/types/api'

export function getAdminUsers(params?: {
  role?: UserRole
  status?: UserStatus
  query?: string
}): Promise<UserSummary[]> {
  const qs = new URLSearchParams()
  if (params?.role) qs.set('role', params.role)
  if (params?.status) qs.set('status', params.status)
  if (params?.query) qs.set('query', params.query)
  const suffix = qs.toString() ? `?${qs.toString()}` : ''
  return api.get<PageResponse<UserSummary> | UserSummary[]>(`/admin/users${suffix}`).then(extractList)
}

export function suspendUser(id: number): Promise<void> {
  return api.patch<void>(`/admin/users/${id}/suspend`)
}

export function deleteUser(id: number): Promise<void> {
  return api.delete<void>(`/admin/users/${id}`)
}

export function getAdminProducts(status?: ProductStatus): Promise<AdminProductItem[]> {
  const suffix = status ? `?status=${status}` : ''
  return api.get<PageResponse<AdminProductItem> | AdminProductItem[]>(`/admin/products${suffix}`).then(extractList)
}

export function forceCloseProduct(id: number): Promise<void> {
  return api.patch<void>(`/admin/products/${id}/force-close`)
}
