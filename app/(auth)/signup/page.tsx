'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { UserRole } from '@/types/api'

export default function SignupPage() {
  const [role, setRole] = useState<UserRole>('CONSUMER')

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <MapPin className="w-5 h-5 text-primary" />
          <span className="text-xl font-bold text-primary">NearPick</span>
        </div>
        <CardTitle className="text-base font-semibold">회원가입</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 역할 선택 */}
        <div className="space-y-2">
          <Label>가입 유형</Label>
          <div className="grid grid-cols-2 gap-2">
            {(['CONSUMER', 'MERCHANT'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  role === r
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border text-foreground hover:bg-muted'
                }`}
              >
                {r === 'CONSUMER' ? '소비자' : '소상공인'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <Input id="email" type="email" placeholder="example@email.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">비밀번호</Label>
          <Input id="password" type="password" placeholder="8자 이상 입력" />
        </div>

        {/* 소상공인 추가 정보 */}
        {role === 'MERCHANT' && (
          <>
            <Separator />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              가게 정보
            </p>
            <div className="space-y-2">
              <Label htmlFor="shopName">가게명</Label>
              <Input id="shopName" placeholder="역삼 커피랩" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bizNo">사업자 번호</Label>
              <Input id="bizNo" placeholder="000-00-00000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shopAddress">가게 주소</Label>
              <Input id="shopAddress" placeholder="서울 강남구 역삼동 123" />
            </div>
          </>
        )}

        <Button className="w-full bg-primary hover:bg-primary/90">가입하기</Button>
        <p className="text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            로그인 →
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
