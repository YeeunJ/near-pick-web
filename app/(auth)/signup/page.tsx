'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { signupConsumer, signupMerchant } from '@/lib/api/auth'
import type { UserRole } from '@/types/api'

export default function SignupPage() {
  const router = useRouter()
  const [role, setRole] = useState<UserRole>('CONSUMER')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [businessRegNo, setBusinessRegNo] = useState('')
  const [shopAddress, setShopAddress] = useState('')
  const [shopLat, setShopLat] = useState('')
  const [shopLng, setShopLng] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (role === 'MERCHANT') {
        await signupMerchant({
          email,
          password,
          businessName,
          businessRegNo,
          shopAddress,
          shopLat: Number(shopLat),
          shopLng: Number(shopLng),
        })
      } else {
        await signupConsumer({ email, password })
      }
      router.push('/login')
    } catch {
      setError('회원가입에 실패했습니다. 입력 정보를 확인해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <MapPin className="w-5 h-5 text-primary" />
          <span className="text-xl font-bold text-primary">NearPick</span>
        </div>
        <CardTitle className="text-base font-semibold">회원가입</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="8자 이상 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {role === 'MERCHANT' && (
            <>
              <Separator />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                가게 정보
              </p>
              <div className="space-y-2">
                <Label htmlFor="businessName">가게명</Label>
                <Input
                  id="businessName"
                  placeholder="역삼 커피랩"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bizNo">사업자 번호</Label>
                <Input
                  id="bizNo"
                  placeholder="000-00-00000"
                  value={businessRegNo}
                  onChange={(e) => setBusinessRegNo(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shopAddress">가게 주소</Label>
                <Input
                  id="shopAddress"
                  placeholder="서울시 강남구 역삼동 123"
                  value={shopAddress}
                  onChange={(e) => setShopAddress(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="shopLat">위도 (Lat)</Label>
                  <Input
                    id="shopLat"
                    type="number"
                    step="any"
                    placeholder="37.5"
                    value={shopLat}
                    onChange={(e) => setShopLat(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopLng">경도 (Lng)</Label>
                  <Input
                    id="shopLng"
                    type="number"
                    step="any"
                    placeholder="127.0"
                    value={shopLng}
                    onChange={(e) => setShopLng(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? '처리 중...' : '가입하기'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              로그인 →
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
