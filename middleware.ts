import { NextRequest, NextResponse } from 'next/server'

const CONSUMER_PATHS = ['/', '/products', '/mypage']
const MERCHANT_PATHS = ['/merchant']
const ADMIN_PATHS = ['/admin']
const PUBLIC_PATHS = ['/login', '/signup']

function matchesPath(pathname: string, paths: string[]): boolean {
  return paths.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('role')?.value

  // 공개 경로: 로그인 상태면 role별 홈으로
  if (matchesPath(pathname, PUBLIC_PATHS)) {
    if (token && role) {
      const home =
        role === 'MERCHANT' ? '/merchant/dashboard' :
        role === 'ADMIN' ? '/admin/users' : '/'
      return NextResponse.redirect(new URL(home, request.url))
    }
    return NextResponse.next()
  }

  // 보호 경로: 미인증 시 로그인으로
  const isProtected =
    matchesPath(pathname, CONSUMER_PATHS) ||
    matchesPath(pathname, MERCHANT_PATHS) ||
    matchesPath(pathname, ADMIN_PATHS)

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 권한 불일치 처리
  if (matchesPath(pathname, MERCHANT_PATHS) && role !== 'MERCHANT') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  if (matchesPath(pathname, ADMIN_PATHS) && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/products/:path*', '/mypage/:path*', '/merchant/:path*', '/admin/:path*', '/login', '/signup'],
}
