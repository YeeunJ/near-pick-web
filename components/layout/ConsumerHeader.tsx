'use client'

import { useState } from 'react'
import { MapPin, ChevronDown, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { LocationPicker } from '@/components/features/LocationPicker'
import { useLocationStore } from '@/lib/store/locationStore'

interface ConsumerHeaderProps {
  showBack?: boolean
  title?: string
}

export function ConsumerHeader({
  showBack = false,
  title,
}: ConsumerHeaderProps) {
  const router = useRouter()
  const { location } = useLocationStore()
  const [pickerOpen, setPickerOpen] = useState(false)

  if (showBack && title) {
    return (
      <header className="sticky top-0 z-10 bg-card border-b border-border flex items-center h-14 px-4 gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => router.back()}
        >
          <ChevronDown className="rotate-90 w-5 h-5" />
        </Button>
        <h1 className="font-semibold text-base flex-1 text-center pr-9">{title}</h1>
      </header>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-10 bg-card border-b border-border flex items-center justify-between h-14 px-4">
        <button
          className="flex items-center gap-1 text-sm font-semibold"
          onClick={() => setPickerOpen(true)}
        >
          <MapPin className="w-4 h-4 text-primary" />
          <span>{location.displayName}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
      </header>
      <LocationPicker open={pickerOpen} onOpenChange={setPickerOpen} />
    </>
  )
}
