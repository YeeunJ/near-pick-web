import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LocationSource } from '@/types/api'

export interface Location {
  lat: number
  lng: number
  displayName: string
}

const DEFAULT_LOCATION: Location = {
  lat: 37.5665,
  lng: 126.978,
  displayName: '서울 중구',
}

interface LocationState {
  location: Location
  locationSource: LocationSource
  savedLocationId: number | null

  setLocation: (location: Location) => void
  setGpsLocation: (lat: number, lng: number) => void
  setLocationSource: (source: LocationSource, savedLocationId?: number) => void
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      location: DEFAULT_LOCATION,
      locationSource: 'DIRECT' as LocationSource,
      savedLocationId: null,

      setLocation(location: Location) {
        set({ location, locationSource: 'DIRECT', savedLocationId: null })
      },

      setGpsLocation(lat: number, lng: number) {
        set({
          location: { lat, lng, displayName: '내 위치' },
          locationSource: 'CURRENT',
          savedLocationId: null,
        })
      },

      setLocationSource(source: LocationSource, savedLocationId?: number) {
        set({ locationSource: source, savedLocationId: savedLocationId ?? null })
      },
    }),
    { name: 'nearpick-location' },
  ),
)
