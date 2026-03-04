import { useEffect, useState } from 'react'

const DEFAULT_LOCATION = { lat: 37.5665, lng: 126.978 }

interface UseGeolocationResult {
  lat: number
  lng: number
  loading: boolean
  error: string | null
}

export function useGeolocation(): UseGeolocationResult {
  const [lat, setLat] = useState(DEFAULT_LOCATION.lat)
  const [lng, setLng] = useState(DEFAULT_LOCATION.lng)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('위치 정보를 지원하지 않는 브라우저입니다.')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude)
        setLng(position.coords.longitude)
        setLoading(false)
      },
      () => {
        setError('위치 권한이 거부되어 기본 위치를 사용합니다.')
        setLoading(false)
      },
    )
  }, [])

  return { lat, lng, loading, error }
}
