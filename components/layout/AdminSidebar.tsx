'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, Package, LogOut, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store/authStore'

const NAV_ITEMS = [
  { href: '/admin/users',    icon: Users,   label: '사용자 관리' },
  { href: '/admin/products', icon: Package, label: '상품 검수' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuthStore()

  return (
    <aside className="w-56 shrink-0 bg-card border-r border-border flex flex-col min-h-screen">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <span className="font-bold text-base">관리자</span>
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-foreground hover:bg-muted',
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-border">
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={logout}>
          <LogOut className="w-4 h-4" />
          로그아웃
        </Button>
      </div>
    </aside>
  )
}
