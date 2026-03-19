import { api } from './client'
import type {
  CreateSavedLocationRequest,
  LocationSearchResult,
  SavedLocationResponse,
  UpdateSavedLocationRequest,
} from '@/types/api'

export function updateCurrentLocation(lat: number, lng: number): Promise<void> {
  return api.patch<void>('/consumers/me/location', { lat, lng })
}

export function getSavedLocations(): Promise<SavedLocationResponse[]> {
  return api.get<SavedLocationResponse[]>('/consumers/me/locations')
}

export function addSavedLocation(
  body: CreateSavedLocationRequest,
): Promise<SavedLocationResponse> {
  return api.post<SavedLocationResponse>('/consumers/me/locations', body)
}

export function updateSavedLocation(
  id: number,
  body: UpdateSavedLocationRequest,
): Promise<SavedLocationResponse> {
  return api.put<SavedLocationResponse>(`/consumers/me/locations/${id}`, body)
}

export function deleteSavedLocation(id: number): Promise<void> {
  return api.delete<void>(`/consumers/me/locations/${id}`)
}

export function setDefaultLocation(id: number): Promise<SavedLocationResponse> {
  return api.patch<SavedLocationResponse>(`/consumers/me/locations/${id}/default`)
}

export function searchAddress(query: string): Promise<LocationSearchResult[]> {
  return api.get<LocationSearchResult[]>(
    `/location/search?query=${encodeURIComponent(query)}`,
  )
}
