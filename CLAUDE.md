# CLAUDE.md — near-pick-web

This file provides guidance to Claude Code when working in this repository.

## Project Overview

`near-pick-web` is the **frontend** for the NearPick platform.
- **Stack**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui v3 (new-york style)
- **Package manager**: pnpm
- **Purpose**: UI for NearPick — 지역 기반 실시간 인기 상품 커머스 플랫폼

### What is NearPick?
- 소비자: 근처 인기 상품 탐색 → 찜/예약/선착순 구매
- 소상공인: 상품·할인권 등록 → 노출/판매
- 관리자: 플랫폼 관리·모니터링
- 배송 없음 (직접 방문 수령)

## Backend (Spring Boot)

**Backend repo**: `/Users/jeong-yeeun/git/ai-project/near-pick`
- Spring Boot 4.0.3, Kotlin 2.2.21, Java 17
- Runs on: `http://localhost:8080`
- API base path: `/api`

### Key API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | 로그인 → `{ accessToken, userId, role }` |
| POST | `/api/auth/signup` | 회원가입 → `{ userId, email, role }` |
| GET | `/api/products/nearby` | 근처 상품 목록 (params: lat, lng, radius) |
| GET | `/api/products/{id}` | 상품 상세 |
| POST | `/api/wishlist/{productId}` | 찜 추가 |
| DELETE | `/api/wishlist/{productId}` | 찜 해제 |
| GET | `/api/wishlist` | 찜 목록 |
| POST | `/api/reservations` | 예약 생성 |
| GET | `/api/reservations` | 예약 목록 |
| DELETE | `/api/reservations/{id}` | 예약 취소 |
| POST | `/api/flash-purchases` | 선착순 구매 |
| GET | `/api/flash-purchases` | 구매 내역 |
| GET | `/api/merchant/dashboard` | 소상공인 대시보드 |
| GET | `/api/merchant/products` | 내 상품 목록 |
| POST | `/api/merchant/products` | 상품 등록 |
| PATCH | `/api/merchant/products/{id}/close` | 상품 종료 |
| GET | `/api/merchant/reservations` | 예약 목록 |
| PATCH | `/api/merchant/reservations/{id}/confirm` | 예약 확정 |
| GET | `/api/admin/users` | 사용자 목록 |
| PATCH | `/api/admin/users/{id}/suspend` | 사용자 정지 |
| DELETE | `/api/admin/users/{id}` | 사용자 탈퇴 |
| GET | `/api/admin/products` | 전체 상품 목록 |
| PATCH | `/api/admin/products/{id}/force-close` | 상품 강제종료 |

### Response Format

모든 API는 `ApiResponse<T>` 래핑:
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

## Project Structure

```
near-pick-web/
├── app/
│   ├── layout.tsx                    # Root layout (lang="ko")
│   ├── globals.css                   # NearPick 디자인 토큰 + shadcn/ui
│   ├── (auth)/                       # Auth group (centered card layout)
│   │   ├── login/page.tsx            # AUTH-01: 로그인
│   │   └── signup/page.tsx           # AUTH-02: 회원가입
│   ├── (consumer)/                   # Consumer group (ConsumerHeader + BottomNav)
│   │   ├── page.tsx                  # CON-01: 홈 (/)
│   │   ├── products/[id]/page.tsx    # CON-02: 상품 상세
│   │   ├── products/[id]/reserve/    # CON-03: 예약
│   │   ├── products/[id]/purchase/   # CON-04: 선착순 구매
│   │   └── mypage/                   # CON-05: 마이페이지
│   │       ├── wishlist/page.tsx
│   │       ├── reservations/page.tsx
│   │       └── purchases/page.tsx
│   ├── (merchant)/                   # Merchant group (MerchantSidebar)
│   │   └── merchant/
│   │       ├── dashboard/page.tsx    # MER-01 → /merchant/dashboard
│   │       ├── products/page.tsx     # MER-03 → /merchant/products
│   │       ├── products/new/page.tsx # MER-02 → /merchant/products/new
│   │       └── reservations/page.tsx # MER-04 → /merchant/reservations
│   └── (admin)/                      # Admin group (AdminSidebar)
│       └── admin/
│           ├── users/page.tsx        # ADM-01 → /admin/users
│           └── products/page.tsx     # ADM-02 → /admin/products
├── components/
│   ├── ui/                           # shadcn/ui 컴포넌트 (자동 생성)
│   │   └── EmptyState.tsx            # 커스텀 빈 상태 컴포넌트
│   ├── layout/
│   │   ├── ConsumerHeader.tsx        # 상단 헤더 (소비자)
│   │   ├── BottomNav.tsx             # 하단 탭 네비게이션
│   │   ├── MerchantSidebar.tsx       # 사이드바 (소상공인)
│   │   ├── AdminSidebar.tsx          # 사이드바 (관리자)
│   │   └── PageHeader.tsx            # 페이지 상단 헤더 (뒤로가기 포함)
│   └── features/
│       ├── StatusBadge.tsx           # 상태 배지 (상품/예약/사용자)
│       └── product/ProductCard.tsx   # 상품 카드
├── lib/
│   ├── utils.ts                      # cn, formatPrice, formatDate, formatDateTime
│   └── mock/                         # 목업 데이터
│       ├── products.ts
│       ├── reservations.ts
│       └── users.ts
└── types/
    └── api.ts                        # 백엔드 DTO와 1:1 싱크 타입 정의
```

## Design System

### NearPick 브랜드 색상 (Tailwind v4)
| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` / `text-primary` | #1A8C5A | CTA 버튼, 강조 텍스트 |
| `bg-primary-light` | #ECF9F3 | 연한 그린 배경 |
| `bg-flash` / `text-flash` | #FF6B35 | FLASH 배지 (향후 적용) |
| `bg-surface` | #F8F7F4 | 앱 배경 |
| `bg-destructive` | red | 오류, 정지, 강제종료 |

### 주의사항 (Tailwind v4)
- `tailwind.config.ts` 없음 — CSS `@theme inline` 방식 사용
- 색상은 `globals.css`에서 CSS 변수로 정의
- shadcn/ui v3 (new-york style) 사용

## Build & Run

```bash
# 개발 서버 실행
pnpm dev

# 타입 체크 + 빌드
pnpm build

# 빌드 결과 실행
pnpm start
```

## Phase Progress

- Phase 5 Design System: ✅ COMPLETED (Mock data 기반, API 연동 전)
- Phase 6 UI Integration: TODO — 백엔드 API 실제 연동

## Next Steps (Phase 6)

1. `lib/api/` 클라이언트 레이어 구현 (axios 또는 fetch 기반)
2. JWT 토큰 저장/관리 (localStorage 또는 httpOnly cookie)
3. Auth 상태 관리 (Zustand 또는 React Context)
4. 각 페이지 API 연동 (mock 데이터 → 실제 API 호출)
5. 위치 정보 획득 (Geolocation API)
