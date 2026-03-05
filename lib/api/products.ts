import { api } from './client'
import type { PageResponse, ProductDetailResponse, ProductSummaryResponse } from '@/types/api'

export function getNearbyProducts(
  lat: number,
  lng: number,
  radius: number,
): Promise<ProductSummaryResponse[]> {
  return api
    .get<PageResponse<ProductSummaryResponse>>(
      `/products/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
    )
    .then((r) => r.content)
}

export function getProductDetail(id: number): Promise<ProductDetailResponse> {
  return api.get<ProductDetailResponse>(`/products/${id}`)
}
