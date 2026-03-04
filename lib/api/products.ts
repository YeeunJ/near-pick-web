import { api } from './client'
import type { ProductDetailResponse, ProductSummaryResponse } from '@/types/api'

export function getNearbyProducts(
  lat: number,
  lng: number,
  radius: number,
): Promise<ProductSummaryResponse[]> {
  return api.get<ProductSummaryResponse[]>(
    `/products/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
  )
}

export function getProductDetail(id: number): Promise<ProductDetailResponse> {
  return api.get<ProductDetailResponse>(`/products/${id}`)
}
