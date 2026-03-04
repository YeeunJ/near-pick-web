import { api } from './client'
import type { CreateReservationRequest, ReservationItem } from '@/types/api'

export function createReservation(body: CreateReservationRequest): Promise<ReservationItem> {
  return api.post<ReservationItem>('/reservations', body)
}

export function getReservations(): Promise<ReservationItem[]> {
  return api.get<ReservationItem[]>('/reservations')
}

export function cancelReservation(id: number): Promise<void> {
  return api.delete<void>(`/reservations/${id}`)
}
