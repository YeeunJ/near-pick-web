'use client'

import { useEffect, useState } from 'react'
import { MapPin, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { SavedLocationList } from '@/components/features/location/SavedLocationList'
import { AddLocationModal } from '@/components/features/location/AddLocationModal'
import {
  deleteSavedLocation,
  getSavedLocations,
  setDefaultLocation,
} from '@/lib/api/location'
import type { SavedLocationResponse } from '@/types/api'

export default function LocationsPage() {
  const [locations, setLocations] = useState<SavedLocationResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [addModalOpen, setAddModalOpen] = useState(false)

  useEffect(() => {
    getSavedLocations()
      .then(setLocations)
      .catch(() => setLocations([]))
      .finally(() => setLoading(false))
  }, [])

  async function handleSetDefault(id: number) {
    try {
      const updated = await setDefaultLocation(id)
      setLocations((prev) =>
        prev.map((loc) =>
          loc.id === id ? updated : { ...loc, isDefault: false },
        ),
      )
    } catch { /* 실패 무시 */ }
  }

  async function handleDelete(id: number) {
    try {
      await deleteSavedLocation(id)
      setLocations((prev) => prev.filter((loc) => loc.id !== id))
    } catch { /* 실패 무시 */ }
  }

  function handleAdded(location: SavedLocationResponse) {
    setLocations((prev) => {
      const updated = location.isDefault
        ? prev.map((l) => ({ ...l, isDefault: false }))
        : prev
      return [...updated, location]
    })
  }

  return (
    <div className="flex flex-col">
      <PageHeader title="저장 위치 관리" showBack />

      <SavedLocationList
        locations={locations}
        onSetDefault={handleSetDefault}
        onDelete={handleDelete}
        loading={loading}
      />

      <div className="px-4 mt-4 space-y-2">
        {locations.length < 5 ? (
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setAddModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            위치 추가
          </Button>
        ) : (
          <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3" />
            최대 5개까지 저장 가능합니다.
          </p>
        )}
      </div>

      <AddLocationModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdded={handleAdded}
      />
    </div>
  )
}
