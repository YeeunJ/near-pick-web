'use client'

import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface PageHeaderProps {
  title: string
  showBack?: boolean
  action?: React.ReactNode
}

export function PageHeader({ title, showBack = false, action }: PageHeaderProps) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-10 bg-card border-b border-border flex items-center h-14 px-4 gap-2">
      {showBack && (
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 -ml-2"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      )}
      <h1 className="font-semibold text-base flex-1">{title}</h1>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}
