import { api } from './client'
import type {
  CreateProductRequest,
  MerchantDashboardResponse,
  PageResponse,
  ProductListItem,
  ReservationItem,
  ReservationStatusResponse,
} from '@/types/api'

export function getMerchantDashboard(): Promise<MerchantDashboardResponse> {
  return api.get<MerchantDashboardResponse>('/merchants/me/dashboard')
}

export function getMerchantProducts(): Promise<ProductListItem[]> {
  return api.get<PageResponse<ProductListItem>>('/products/me').then((r) => r.content)
}

export function createProduct(body: CreateProductRequest): Promise<void> {
  return api.post<void>('/products', body)
}

export function closeProduct(id: number): Promise<void> {
  return api.patch<void>(`/products/${id}/close`)
}

export function getMerchantReservations(): Promise<ReservationItem[]> {
  return api.get<PageResponse<ReservationItem>>('/reservations/merchant').then((r) => r.content)
}

export function confirmReservation(id: number): Promise<ReservationStatusResponse> {
  return api.patch<ReservationStatusResponse>(`/reservations/${id}/confirm`)
}
