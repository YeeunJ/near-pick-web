import { MapPin, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { SavedLocationResponse } from '@/types/api'

interface SavedLocationListProps {
  locations: SavedLocationResponse[]
  onSetDefault: (id: number) => void
  onDelete: (id: number) => void
  loading?: boolean
}

export function SavedLocationList({
  locations,
  onSetDefault,
  onDelete,
  loading,
}: SavedLocationListProps) {
  if (loading) {
    return (
      <ul className="divide-y divide-border">
        {[1, 2].map((i) => (
          <li key={i} className="flex items-center gap-3 py-3 px-4">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-4 flex-1" />
          </li>
        ))}
      </ul>
    )
  }

  if (locations.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        저장된 위치가 없습니다.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-border">
      {locations.map((loc) => (
        <li key={loc.id} className="flex items-center gap-3 py-3 px-4">
          <MapPin
            className={`w-5 h-5 shrink-0 ${loc.isDefault ? 'text-primary' : 'text-muted-foreground'}`}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{loc.label}</p>
            {loc.isDefault && (
              <p className="text-xs text-primary">기본 위치</p>
            )}
          </div>
          {!loc.isDefault && (
            <Button
              size="sm"
              variant="ghost"
              className="text-xs shrink-0"
              onClick={() => onSetDefault(loc.id)}
            >
              기본 설정
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="shrink-0 text-destructive hover:text-destructive"
            onClick={() => onDelete(loc.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </li>
      ))}
    </ul>
  )
}
