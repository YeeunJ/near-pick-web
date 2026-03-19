import { api, extractList } from './client'
import type {
  LocationSource,
  PageResponse,
  ProductCategory,
  ProductDetailResponse,
  ProductSummaryResponse,
  SortType,
} from '@/types/api'

interface NearbyParams {
  lat?: number
  lng?: number
  radius: number
  sort?: SortType
  locationSource?: LocationSource
  savedLocationId?: number
  category?: ProductCategory
}

export function getNearbyProducts(params: NearbyParams): Promise<ProductSummaryResponse[]> {
  const q = new URLSearchParams()
  if (params.lat !== undefined) q.set('lat', String(params.lat))
  if (params.lng !== undefined) q.set('lng', String(params.lng))
  q.set('radius', String(params.radius))
  if (params.sort) q.set('sort', params.sort)
  if (params.locationSource) q.set('locationSource', params.locationSource)
  if (params.savedLocationId !== undefined) q.set('savedLocationId', String(params.savedLocationId))
  if (params.category) q.set('category', params.category)

  return api
    .get<PageResponse<ProductSummaryResponse>>(`/products/nearby?${q.toString()}`)
    .then(extractList)
}

export function getProductDetail(id: number): Promise<ProductDetailResponse> {
  return api.get<ProductDetailResponse>(`/products/${id}`)
}
