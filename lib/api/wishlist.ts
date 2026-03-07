import { api, extractList } from './client'
import type { PageResponse, WishlistItem } from '@/types/api'

export function getWishlist(): Promise<WishlistItem[]> {
  return api.get<PageResponse<WishlistItem> | WishlistItem[]>('/wishlists/me').then(extractList)
}

export function addWishlist(productId: number): Promise<void> {
  return api.post<void>('/wishlists', { productId })
}

export function removeWishlist(productId: number): Promise<void> {
  return api.delete<void>(`/wishlists/${productId}`)
}
