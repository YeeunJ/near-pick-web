'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { addSavedLocation, searchAddress } from '@/lib/api/location'
import type { LocationSearchResult, SavedLocationResponse } from '@/types/api'

interface AddLocationModalProps {
  open: boolean
  onClose: () => void
  onAdded: (location: SavedLocationResponse) => void
}

export function AddLocationModal({ open, onClose, onAdded }: AddLocationModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<LocationSearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState<LocationSearchResult | null>(null)
  const [label, setLabel] = useState('')
  const [isDefault, setIsDefault] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!open) {
      setQuery('')
      setResults([])
      setSelected(null)
      setLabel('')
      setIsDefault(false)
      setError(null)
    }
  }, [open])

  useEffect(() => {
    if (!query.trim() || selected) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await searchAddress(query)
        setResults(res)
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 500)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, selected])

  function handleSelectResult(result: LocationSearchResult) {
    setSelected(result)
    setLabel(result.address.slice(0, 20))
    setResults([])
  }

  async function handleSave() {
    if (!selected || !label.trim()) return
    setSaving(true)
    setError(null)
    try {
      const saved = await addSavedLocation({
        label: label.trim(),
        lat: selected.lat,
        lng: selected.lng,
        isDefault,
      })
      onAdded(saved)
      onClose()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '위치 저장에 실패했습니다.'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>위치 추가</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!selected ? (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="주소 검색..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
              </div>
              {searching && (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              )}
              {results.length > 0 && (
                <ul className="border rounded-lg divide-y divide-border max-h-60 overflow-y-auto">
                  {results.map((r, i) => (
                    <li key={i}>
                      <button
                        className="w-full text-left px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                        onClick={() => handleSelectResult(r)}
                      >
                        {r.address}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground bg-muted rounded px-3 py-2">
                {selected.address}
              </p>
              <div className="space-y-2">
                <Label htmlFor="loc-label">라벨</Label>
                <Input
                  id="loc-label"
                  placeholder="예: 집, 회사"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="is-default"
                  checked={isDefault}
                  onCheckedChange={(v) => setIsDefault(Boolean(v))}
                />
                <Label htmlFor="is-default" className="text-sm font-normal cursor-pointer">
                  기본 위치로 설정
                </Label>
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelected(null)}
                  disabled={saving}
                >
                  다시 검색
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleSave}
                  disabled={saving || !label.trim()}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : '저장'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
