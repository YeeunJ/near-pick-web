'use client'

import Link from 'next/link'
import { Heart, Calendar, ShoppingBag, ChevronRight, LogOut, User, MapPin } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store/authStore'

const ROLE_LABEL: Record<string, string> = {
  CONSUMER: '소비자',
  MERCHANT: '소상공인',
  ADMIN: '관리자',
}

const ALL_MENU = [
  { href: '/mypage/wishlist', icon: Heart, label: '찜 목록', roles: ['CONSUMER'] },
  { href: '/mypage/reservations', icon: Calendar, label: '예약 내역', roles: ['CONSUMER'] },
  { href: '/mypage/purchases', icon: ShoppingBag, label: '구매 내역', roles: ['CONSUMER'] },
  { href: '/mypage/locations', icon: MapPin, label: '저장 위치 관리', roles: ['CONSUMER'] },
]

export default function MyPage() {
  const { userId, role, logout } = useAuthStore()
  const MY_MENU = ALL_MENU.filter((item) => !role || item.roles.includes(role))

  return (
    <div className="flex flex-col">
      <PageHeader title="마이페이지" />

      {/* 프로필 카드 */}
      <div className="bg-primary-light px-4 py-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <User className="w-7 h-7 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">회원 번호 {userId}</p>
          <p className="font-semibold text-base">
            {role ? ROLE_LABEL[role] ?? role : ''}
          </p>
        </div>
      </div>

      {/* 메뉴 */}
      <ul className="divide-y divide-border mt-2">
        {MY_MENU.map(({ href, icon: Icon, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex items-center gap-3 px-4 py-4 hover:bg-muted transition-colors"
            >
              <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
              <span className="flex-1 text-sm font-medium">{label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>

      {/* 로그아웃 */}
      <div className="px-4 mt-6">
        <Button
          variant="outline"
          className="w-full text-destructive border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          로그아웃
        </Button>
      </div>
    </div>
  )
}
