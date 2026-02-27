'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Heart, Calendar, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/',                    icon: Home,     label: '홈' },
  { href: '/mypage/wishlist',     icon: Heart,    label: '찜' },
  { href: '/mypage/reservations', icon: Calendar, label: '예약' },
  { href: '/mypage/purchases',    icon: User,     label: '마이' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border z-10">
      <ul className="flex">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  'flex flex-col items-center gap-1 py-2.5 text-xs transition-colors',
                  active
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className={cn('w-5 h-5', active && 'fill-primary/20')} />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
