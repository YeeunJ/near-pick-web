# Phase 6 — UI Integration Design

> **Feature**: phase6-ui-integration
> **Phase**: Design
> **Date**: 2026-03-04
> **Reference**: [phase6-ui-integration.plan.md](../../01-plan/features/phase6-ui-integration.plan.md)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App Router                    │
├─────────────────────────────────────────────────────────┤
│  middleware.ts  ← 라우트 보호 (토큰/role 검사)             │
├─────────────────────────────────────────────────────────┤
│  app/ (Pages)   ← 'use client' + API 호출 + 상태 렌더링  │
├─────────────────────────────────────────────────────────┤
│  lib/store/     ← Zustand Auth Store (토큰/role 관리)    │
├─────────────────────────────────────────────────────────┤
│  lib/api/       ← fetch wrapper + 도메인별 API 함수      │
├─────────────────────────────────────────────────────────┤
│  lib/hooks/     ← useGeolocation                        │
├─────────────────────────────────────────────────────────┤
│  Spring Boot API  http://localhost:8080/api              │
└─────────────────────────────────────────────────────────┘
```

---

## 2. File Structure

### 2.1 신규 파일

```
near-pick-web/
├── middleware.ts                        # 라우트 보호 (루트 레벨)
├── .env.example                         # 환경변수 예시
├── lib/
│   ├── api/
│   │   ├── client.ts                    # fetch wrapper (공통)
│   │   ├── auth.ts                      # 인증 API
│   │   ├── products.ts                  # 상품 API
│   │   ├── wishlist.ts                  # 찜 API
│   │   ├── reservations.ts              # 예약 API
│   │   ├── flashPurchases.ts            # 선착순 구매 API
│   │   ├── merchant.ts                  # 소상공인 API
│   │   └── admin.ts                     # 관리자 API
│   ├── store/
│   │   └── authStore.ts                 # Zustand 인증 상태
│   └── hooks/
│       └── useGeolocation.ts            # Geolocation hook
```

### 2.2 수정 파일

```
types/
└── api.ts                               # Request 타입 추가

app/
├── (auth)/login/page.tsx                # API 연동
├── (auth)/signup/page.tsx               # API 연동
├── (consumer)/page.tsx                  # API 연동 + Geolocation
├── (consumer)/products/[id]/page.tsx    # API 연동
├── (consumer)/products/[id]/reserve/page.tsx
├── (consumer)/products/[id]/purchase/page.tsx
├── (consumer)/mypage/wishlist/page.tsx
├── (consumer)/mypage/reservations/page.tsx
├── (consumer)/mypage/purchases/page.tsx
├── (merchant)/merchant/dashboard/page.tsx
├── (merchant)/merchant/products/page.tsx
├── (merchant)/merchant/products/new/page.tsx
├── (merchant)/merchant/reservations/page.tsx
├── (admin)/admin/users/page.tsx
└── (admin)/admin/products/page.tsx
```

---

## 3. 환경변수

### `.env.example`

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

---

## 4. API Client (`lib/api/client.ts`)

### 4.1 역할

- 모든 API 호출의 공통 레이어
- `Authorization: Bearer {token}` 헤더 자동 첨부
- `ApiResponse<T>` 언래핑 — `data` 만 반환
- 401 응답 시 `/login` 리다이렉트
- 네트워크/서버 에러 시 `ApiError` throw

### 4.2 인터페이스

```typescript
// lib/api/client.ts

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) { super(message) }
}

async function apiRequest<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T>

// 편의 함수
export const api = {
  get:    <T>(path: string, token?: string) => Promise<T>
  post:   <T>(path: string, body: unknown, token?: string) => Promise<T>
  patch:  <T>(path: string, body?: unknown, token?: string) => Promise<T>
  delete: <T>(path: string, token?: string) => Promise<T>
}
```

### 4.3 토큰 획득 순서

1. 함수 인자로 직접 전달된 `token`
2. `localStorage.getItem('accessToken')` (클라이언트)
3. 없으면 헤더 미첨부 (공개 API용)

---

## 5. Zustand Auth Store (`lib/store/authStore.ts`)

### 5.1 State

```typescript
interface AuthState {
  accessToken: string | null
  userId: number | null
  role: UserRole | null

  // Actions
  login: (result: LoginResult) => void
  logout: () => void
  isAuthenticated: () => boolean
}
```

### 5.2 동작 규칙

| Action | 동작 |
|--------|------|
| `login(result)` | Zustand state 업데이트 + `localStorage` 저장 + `cookie` 저장 |
| `logout()` | Zustand state 초기화 + `localStorage` 제거 + `cookie` 제거 + `/login` 이동 |
| 초기화 | `localStorage`에서 토큰 복원 (새로고침 유지) |

### 5.3 저장 위치 (이중 저장)

| 저장소 | 용도 |
|--------|------|
| `localStorage` | 클라이언트 컴포넌트에서 읽기 |
| `cookie` (`token`) | `middleware.ts`에서 서버사이드 읽기 |

---

## 6. 라우트 보호 (`middleware.ts`)

### 6.1 보호 규칙

| 경로 패턴 | 허용 role | 미인증 시 | 권한 불일치 시 |
|-----------|-----------|-----------|----------------|
| `/`, `/products/*`, `/mypage/*` | `CONSUMER` | `/login` | `/login` |
| `/merchant/*` | `MERCHANT` | `/login` | `/` |
| `/admin/*` | `ADMIN` | `/login` | `/` |
| `/login`, `/signup` | 누구나 | — | 로그인 상태면 role별 홈으로 |

### 6.2 토큰 읽기

`middleware.ts`는 서버에서 실행되므로 `cookies()`로 `token` 쿠키 읽기.

```typescript
// middleware.ts 핵심 로직
const token = request.cookies.get('token')?.value
const role = request.cookies.get('role')?.value

if (!token) return redirect('/login')
if (isMerchantPath && role !== 'MERCHANT') return redirect('/')
if (isAdminPath && role !== 'ADMIN') return redirect('/')
```

### 6.3 `matcher` 설정

```typescript
export const config = {
  matcher: ['/', '/products/:path*', '/mypage/:path*',
            '/merchant/:path*', '/admin/:path*']
}
```

---

## 7. Geolocation Hook (`lib/hooks/useGeolocation.ts`)

```typescript
const DEFAULT_LOCATION = { lat: 37.5665, lng: 126.9780 } // 서울 중심

interface UseGeolocationResult {
  lat: number
  lng: number
  loading: boolean
  error: string | null
}

// 사용처: app/(consumer)/page.tsx
const { lat, lng, loading } = useGeolocation()
```

**동작**:
1. 마운트 시 `navigator.geolocation.getCurrentPosition()` 호출
2. 성공 → 실제 좌표 반환
3. 실패(거부/미지원) → `DEFAULT_LOCATION` 반환

---

## 8. 타입 추가 (`types/api.ts`)

기존 Response 타입 유지, Request 타입 추가:

```typescript
// ─── Request Types ─────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  role: UserRole
  shopName?: string        // MERCHANT 필수
  businessRegNo?: string   // MERCHANT 필수
}

export interface CreateReservationRequest {
  productId: number
  visitAt: string          // ISO 8601
  quantity: number
  memo?: string
}

export interface CreateFlashPurchaseRequest {
  productId: number
  quantity: number
}

export interface CreateProductRequest {
  title: string
  description: string
  price: number
  productType: ProductType
  quantity?: number        // FLASH_SALE 필수
  endsAt?: string          // FLASH_SALE 필수, ISO 8601
}

// ─── ApiResponse wrapper ───────────────────────

export interface ApiResponse<T> {
  success: boolean
  data: T
  error: string | null
}
```

---

## 9. 도메인별 API 함수

### 9.1 `lib/api/auth.ts`

```typescript
login(body: LoginRequest): Promise<LoginResult>
signup(body: SignupRequest): Promise<SignupResponse>
```

### 9.2 `lib/api/products.ts`

```typescript
getNearbyProducts(lat: number, lng: number, radius: number): Promise<ProductSummaryResponse[]>
getProductDetail(id: number): Promise<ProductDetailResponse>
```

### 9.3 `lib/api/wishlist.ts`

```typescript
getWishlist(): Promise<WishlistItem[]>
addWishlist(productId: number): Promise<void>
removeWishlist(productId: number): Promise<void>
```

### 9.4 `lib/api/reservations.ts`

```typescript
createReservation(body: CreateReservationRequest): Promise<ReservationItem>
getReservations(): Promise<ReservationItem[]>
cancelReservation(id: number): Promise<void>
```

### 9.5 `lib/api/flashPurchases.ts`

```typescript
createFlashPurchase(body: CreateFlashPurchaseRequest): Promise<FlashPurchaseItem>
getFlashPurchases(): Promise<FlashPurchaseItem[]>
```

### 9.6 `lib/api/merchant.ts`

```typescript
getMerchantDashboard(): Promise<MerchantDashboardResponse>
getMerchantProducts(): Promise<ProductSummaryResponse[]>
createProduct(body: CreateProductRequest): Promise<ProductSummaryResponse>
closeProduct(id: number): Promise<void>
getMerchantReservations(): Promise<ReservationItem[]>
confirmReservation(id: number): Promise<ReservationStatusResponse>
```

### 9.7 `lib/api/admin.ts`

```typescript
getAdminUsers(): Promise<UserSummary[]>
suspendUser(id: number): Promise<void>
deleteUser(id: number): Promise<void>
getAdminProducts(): Promise<ProductSummaryResponse[]>
forceCloseProduct(id: number): Promise<void>
```

---

## 10. 페이지별 연동 설계

### 10.1 공통 패턴

모든 데이터 패칭 페이지에 적용:

```tsx
'use client'

export default function SomePage() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    someApi()
      .then(setData)
      .catch(() => setError('데이터를 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSkeleton />
  if (error)   return <ErrorMessage message={error} />
  // ...render
}
```

### 10.2 AUTH-01: 로그인 (`app/(auth)/login/page.tsx`)

- `login(body)` 호출
- 성공: `useAuthStore.login(result)` → role별 라우팅
  - `CONSUMER` → `router.push('/')`
  - `MERCHANT` → `router.push('/merchant/dashboard')`
  - `ADMIN` → `router.push('/admin/users')`
- 실패: 에러 메시지 표시 (인라인, toast 없이)

### 10.3 AUTH-02: 회원가입 (`app/(auth)/signup/page.tsx`)

- `signup(body)` 호출
- 성공: `router.push('/login')`
- 실패: 에러 메시지 표시

### 10.4 CON-01: 홈 (`app/(consumer)/page.tsx`)

- `useGeolocation()` → `lat`, `lng` 획득
- `lat`/`lng` 준비 완료 후 `getNearbyProducts(lat, lng, radius)` 호출
- `radius`: Select 값 (기본 1km)
- 로딩 중: `ProductCard` skeleton (6개)

### 10.5 CON-02: 상품 상세 (`app/(consumer)/products/[id]/page.tsx`)

- `getProductDetail(id)` 호출
- 찜 버튼: `addWishlist` / `removeWishlist` (낙관적 업데이트)

### 10.6 CON-03: 예약 (`app/(consumer)/products/[id]/reserve/page.tsx`)

- 폼 submit 시 `createReservation(body)` 호출
- 성공: `router.push('/mypage/reservations')`

### 10.7 CON-04: 선착순 구매 (`app/(consumer)/products/[id]/purchase/page.tsx`)

- Dialog 확인 후 `createFlashPurchase(body)` 호출
- 성공: `router.push('/mypage/purchases')`

### 10.8 CON-05: 마이페이지

| 화면 | API | 추가 동작 |
|------|-----|----------|
| 찜 목록 | `getWishlist()` | 삭제 → `removeWishlist(id)` + 목록 갱신 |
| 예약 내역 | `getReservations()` | 취소 → `cancelReservation(id)` + 목록 갱신 |
| 구매 내역 | `getFlashPurchases()` | 목록만 표시 |

### 10.9 MER-01: 소상공인 대시보드

- `getMerchantDashboard()` 호출
- 예약 확정: `confirmReservation(id)` + 목록 갱신

### 10.10 MER-02: 상품 등록

- 폼 submit 시 `createProduct(body)` 호출
- 성공: `router.push('/merchant/products')`

### 10.11 MER-03: 상품 목록

- `getMerchantProducts()` 호출
- 종료 Dialog 확인 후 `closeProduct(id)` + 목록 갱신

### 10.12 MER-04: 예약 관리

- `getMerchantReservations()` 호출
- 확정/거절 → `confirmReservation(id)` + 목록 갱신

### 10.13 ADM-01: 사용자 관리

- `getAdminUsers()` 호출
- 정지: `suspendUser(id)` + 목록 갱신
- 탈퇴: `deleteUser(id)` + 목록 갱신

### 10.14 ADM-02: 상품 관리

- `getAdminProducts()` 호출
- 강제종료: `forceCloseProduct(id)` + 목록 갱신

---

## 11. 로딩 / 에러 UI 규칙

| 상태 | UI |
|------|----|
| 데이터 로딩 중 | `<Skeleton>` — 기존 shadcn/ui skeleton 활용 |
| API 에러 | `<EmptyState>` 컴포넌트 재활용 (icon=AlertCircle) |
| 뮤테이션 진행 중 | 버튼 `disabled` + 텍스트 변경 ("처리 중...") |

---

## 12. 구현 순서

| 순서 | 작업 | 파일 |
|------|------|------|
| 1 | 환경변수 설정 | `.env.local`, `.env.example` |
| 2 | Request 타입 추가 | `types/api.ts` |
| 3 | API 클라이언트 | `lib/api/client.ts` |
| 4 | Auth Store | `lib/store/authStore.ts` |
| 5 | 인증 API + 화면 연동 | `lib/api/auth.ts`, login/signup page |
| 6 | 미들웨어 | `middleware.ts` |
| 7 | Geolocation Hook | `lib/hooks/useGeolocation.ts` |
| 8 | 상품 API + 홈/상세 | `lib/api/products.ts`, consumer pages |
| 9 | 찜/예약/구매 API + 페이지 | `lib/api/wishlist.ts` 등 |
| 10 | 소상공인 API + 페이지 | `lib/api/merchant.ts` |
| 11 | 관리자 API + 페이지 | `lib/api/admin.ts` |
| 12 | 빌드 검증 | `pnpm build` |
