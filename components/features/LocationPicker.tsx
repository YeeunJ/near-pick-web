'use client'

import { useState } from 'react'
import { MapPin, Navigation, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useLocationStore, type Location } from '@/lib/store/locationStore'
import { cn } from '@/lib/utils'

const PRESET_LOCATIONS: Location[] = [
  { lat: 37.5665, lng: 126.978, displayName: '서울 중구' },
  { lat: 37.4979, lng: 127.0276, displayName: '강남구 역삼동' },
  { lat: 37.5172, lng: 127.0473, displayName: '강남구 삼성동' },
  { lat: 37.5143, lng: 126.9794, displayName: '동작구 흑석동' },
  { lat: 37.5511, lng: 126.9882, displayName: '용산구 이태원동' },
  { lat: 37.5796, lng: 126.9770, displayName: '종로구 혜화동' },
  { lat: 37.5400, lng: 127.0700, displayName: '광진구 건대입구' },
  { lat: 37.4833, lng: 126.8969, displayName: '금천구 가산동' },
  { lat: 37.5563, lng: 126.9379, displayName: '마포구 홍대입구' },
  { lat: 37.6054, lng: 126.9921, displayName: '성북구 성신여대입구' },
]

interface LocationPickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LocationPicker({ open, onOpenChange }: LocationPickerProps) {
  const { location, setLocation, setGpsLocation } = useLocationStore()
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsError, setGpsError] = useState<string | null>(null)

  function handleSelect(loc: Location) {
    setLocation(loc)
    onOpenChange(false)
  }

  function handleGps() {
    if (!navigator.geolocation) {
      setGpsError('이 브라우저는 위치 정보를 지원하지 않습니다.')
      return
    }
    setGpsLoading(true)
    setGpsError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLocation(pos.coords.latitude, pos.coords.longitude)
        setGpsLoading(false)
        onOpenChange(false)
      },
      () => {
        setGpsError('위치 권한이 거부되었습니다. 브라우저 설정에서 허용해주세요.')
        setGpsLoading(false)
      },
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-w-[430px] mx-auto rounded-t-2xl pb-8">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-left">위치 설정</SheetTitle>
        </SheetHeader>

        <Button
          variant="outline"
          className="w-full h-12 justify-start gap-3 mb-4"
          onClick={handleGps}
          disabled={gpsLoading}
        >
          <Navigation className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm font-medium">
            {gpsLoading ? 'GPS 위치 가져오는 중...' : '현재 내 위치 사용'}
          </span>
        </Button>

        {gpsError && (
          <p className="text-xs text-destructive mb-3 px-1">{gpsError}</p>
        )}

        <p className="text-xs text-muted-foreground mb-2 px-1">동네 선택</p>
        <ul className="space-y-1">
          {PRESET_LOCATIONS.map((loc) => {
            const isSelected = location.displayName === loc.displayName
            return (
              <li key={loc.displayName}>
                <button
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors',
                    isSelected
                      ? 'bg-primary-light text-primary font-medium'
                      : 'hover:bg-muted text-foreground',
                  )}
                  onClick={() => handleSelect(loc)}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0" />
                    {loc.displayName}
                  </span>
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              </li>
            )
          })}
        </ul>
      </SheetContent>
    </Sheet>
  )
}
