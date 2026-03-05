import { api } from './client'
import type { PageResponse, ProductDetailResponse, ProductSummaryResponse, SortType } from '@/types/api'

export function getNearbyProducts(
  lat: number,
  lng: number,
  radius: number,
  sort: SortType = 'POPULARITY',
): Promise<ProductSummaryResponse[]> {
  return api
    .get<PageResponse<ProductSummaryResponse>>(
      `/products/nearby?lat=${lat}&lng=${lng}&radius=${radius}&sort=${sort}`,
    )
    .then((r) => r.content)
}

export function getProductDetail(id: number): Promise<ProductDetailResponse> {
  return api.get<ProductDetailResponse>(`/products/${id}`)
}
