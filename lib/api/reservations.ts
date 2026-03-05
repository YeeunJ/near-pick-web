import { api } from './client'
import type { CreateReservationRequest, PageResponse, ReservationItem } from '@/types/api'

export function createReservation(body: CreateReservationRequest): Promise<ReservationItem> {
  return api.post<ReservationItem>('/reservations', body)
}

export function getReservations(): Promise<ReservationItem[]> {
  return api.get<PageResponse<ReservationItem>>('/reservations/me').then((r) => r.content)
}

export function cancelReservation(id: number): Promise<void> {
  return api.patch<void>(`/reservations/${id}/cancel`)
}
