'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/authStore'

export function AuthInitializer() {
  const init = useAuthStore((s) => s.init)
  useEffect(() => { init() }, [init])
  return null
}
