import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <MapPin className="w-6 h-6 text-primary" />
          <span className="text-2xl font-bold text-primary">NearPick</span>
        </div>
        <CardTitle className="text-lg font-semibold text-muted-foreground">
          근처 인기 상품을 찾아보세요
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <Input id="email" type="email" placeholder="example@email.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">비밀번호</Label>
          <Input id="password" type="password" placeholder="비밀번호 입력" />
        </div>
        <Button className="w-full bg-primary hover:bg-primary/90">로그인</Button>
        <p className="text-center text-sm text-muted-foreground">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            회원가입 →
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
