import { api } from './client'
import type { WishlistItem } from '@/types/api'

export function getWishlist(): Promise<WishlistItem[]> {
  return api.get<WishlistItem[]>('/wishlist')
}

export function addWishlist(productId: number): Promise<void> {
  return api.post<void>(`/wishlist/${productId}`)
}

export function removeWishlist(productId: number): Promise<void> {
  return api.delete<void>(`/wishlist/${productId}`)
}
