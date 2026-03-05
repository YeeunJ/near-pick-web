import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  setLocation: (location: Location) => void
  setGpsLocation: (lat: number, lng: number) => void
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      location: DEFAULT_LOCATION,

      setLocation(location: Location) {
        set({ location })
      },

      setGpsLocation(lat: number, lng: number) {
        set({ location: { lat, lng, displayName: '내 위치' } })
      },
    }),
    {
      name: 'nearpick-location',
    },
  ),
)
