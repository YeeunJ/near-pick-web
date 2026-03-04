import { api } from './client'
import type {
  CreateProductRequest,
  MerchantDashboardResponse,
  ProductSummaryResponse,
  ReservationItem,
  ReservationStatusResponse,
} from '@/types/api'

export function getMerchantDashboard(): Promise<MerchantDashboardResponse> {
  return api.get<MerchantDashboardResponse>('/merchant/dashboard')
}

export function getMerchantProducts(): Promise<ProductSummaryResponse[]> {
  return api.get<ProductSummaryResponse[]>('/merchant/products')
}

export function createProduct(body: CreateProductRequest): Promise<ProductSummaryResponse> {
  return api.post<ProductSummaryResponse>('/merchant/products', body)
}

export function closeProduct(id: number): Promise<void> {
  return api.patch<void>(`/merchant/products/${id}/close`)
}

export function getMerchantReservations(): Promise<ReservationItem[]> {
  return api.get<ReservationItem[]>('/merchant/reservations')
}

export function confirmReservation(id: number): Promise<ReservationStatusResponse> {
  return api.patch<ReservationStatusResponse>(`/merchant/reservations/${id}/confirm`)
}
