# Completion Report: phase8-bugfix-ux

> **Project**: near-pick-web
> **Phase**: 8 — 버그 수정 및 UX 개선
> **Period**: 2026-03-06 ~ 2026-03-07
> **PR**: #8 (feature/merchant-logout-product-types → main)
> **Status**: ✅ COMPLETED

---

## 1. 개요

Phase 7 완료 이후 실제 동작 테스트에서 발견된 버그들을 수정하고,
소상공인 상품 등록 흐름을 개편하며 찜 기능 UX를 개선한 단계.

---

## 2. 수행 작업 (커밋 순)

### 2.1 소상공인/관리자 로그아웃 수정 + 상품 유형 개편 + 페이지 문서화

**커밋**: `feat: fix logout, split product types, add pages.md`

#### 로그아웃 버그 수정
`MerchantSidebar`, `AdminSidebar` 로그아웃 버튼에 `onClick` 핸들러가 없어 동작하지 않던 문제 수정.
두 컴포넌트 모두 `useAuthStore().logout()` 연결.

#### 상품 유형 개편
| Before | After |
|--------|-------|
| `GENERAL` (일반 상품) | 제거 |
| `FLASH_SALE` (선착순 상품) | `FLASH_SALE` (선착순 구매 상품) 유지 |
| ─ | `RESERVATION` (예약 상품) 신규 추가 |

- `types/api.ts`: `ProductType = 'RESERVATION' | 'FLASH_SALE'`
- 상품 등록 폼: 카드형 유형 선택 UI, 두 유형 모두 수량+마감일시 동일 필드
- 소상공인 상품 목록: 유형 라벨 `일반 → 예약`
- 소비자 상품 상세: `GENERAL → RESERVATION` 예약하기 버튼 조건
- 찜 목록: RESERVATION 배지 추가
- mock 데이터: `GENERAL → RESERVATION` 일괄 변경

#### 페이지 문서화
`docs/pages.md` 신규 생성 — 전체 17개 페이지 URL, 설명, 역할별 접근 권한, 라우트 보호 규칙.

---

### 2.2 미들웨어 / Next.js 16 params / 하이드레이션 수정

**커밋**: `fix: middleware naming, Next.js 16 params, hydration mismatch`

#### middleware.ts 수정 (찜·상세 페이지 접근 불가 원인)
`proxy.ts`는 Next.js가 미들웨어로 인식하지 못함 → `middleware.ts`로 rename, 함수명 `middleware`로 변경.
이로써 라우트 보호(인증 리다이렉트, 역할 분기)가 실제로 동작하게 됨.

#### Next.js 15+ params Promise 대응 (상품 관련 페이지 오작동 원인)
Next.js 15부터 동적 라우트 `params`가 Promise로 변경됨.
`params.id` 직접 접근 → `React.use(params)` 패턴으로 수정.

| 파일 | 수정 내용 |
|------|-----------|
| `products/[id]/page.tsx` | `use(params)` 적용 |
| `products/[id]/reserve/page.tsx` | `use(params)` 적용 |
| `products/[id]/purchase/page.tsx` | `use(params)` 적용 |

#### locationStore 하이드레이션 불일치 수정 (콘솔 경고 원인)
Zustand `persist` 미들웨어 + SSR 조합에서 서버 렌더값과 클라이언트 localStorage 값이 달라 발생하는 hydration mismatch.
`ConsumerHeader`에 `mounted` 상태 추가 → 클라이언트 마운트 후에만 `location.displayName` 렌더링.

---

### 2.3 API 응답 형식 방어 처리

**커밋**: `fix: handle array or PageResponse from backend list APIs`

백엔드가 `PageResponse<T>` 대신 `T[]`를 직접 반환할 경우 `r.content`가 `undefined`가 되어 `items.length` TypeError 발생.

`client.ts`에 `extractList<T>` 헬퍼 추가:
```typescript
export function extractList<T>(r: T[] | { content: T[] }): T[] {
  if (Array.isArray(r)) return r
  return r?.content ?? []
}
```

적용 대상 (8개 API 함수):

| 파일 | 함수 |
|------|------|
| `wishlist.ts` | `getWishlist` |
| `reservations.ts` | `getReservations` |
| `flashPurchases.ts` | `getFlashPurchases` |
| `merchant.ts` | `getMerchantProducts`, `getMerchantReservations` |
| `admin.ts` | `getAdminUsers`, `getAdminProducts` |
| `products.ts` | `getNearbyProducts` |

---

### 2.4 찜 시각적 피드백 및 초기 상태 수정

**커밋**: `feat: wishlist visual feedback and correct initial state`

#### ProductCard (홈 화면)
- 이미지 우상단 반투명 하트 버튼 고정
- 찜 상태: 빨간 채워진 하트 / 미찜: 회색 빈 하트
- 카드 Link 클릭과 독립적으로 동작 (`stopPropagation`)

#### 홈 페이지
- 상품 목록 로드 시 찜 목록 병렬 fetch (`Promise.all`)
- `wishlistedIds: Set<number>` 로 각 카드에 찜 여부 전달
- 찜 토글 시 낙관적 UI 업데이트 (API 응답 전 즉시 반영)

#### 상품 상세 페이지
- 마운트 시 `getWishlist()`로 현재 상품 찜 여부 확인 → `wishlisted` 초기값 정확히 설정
- 찜 상태 버튼: 빨간 배경 + 흰 채워진 하트 / 미찜: outline 버튼

---

## 3. 수정된 파일 목록

| 파일 | 변경 유형 |
|------|----------|
| `proxy.ts → middleware.ts` | rename + 함수명 수정 |
| `types/api.ts` | `GENERAL → RESERVATION` |
| `components/layout/MerchantSidebar.tsx` | logout 연결 |
| `components/layout/AdminSidebar.tsx` | logout 연결 |
| `components/layout/ConsumerHeader.tsx` | mounted 하이드레이션 수정 |
| `components/features/product/ProductCard.tsx` | 찜 버튼 + 시각적 피드백 |
| `lib/api/client.ts` | `extractList` 헬퍼 추가 |
| `lib/api/wishlist.ts` | extractList 적용 |
| `lib/api/reservations.ts` | extractList 적용 |
| `lib/api/flashPurchases.ts` | extractList 적용 |
| `lib/api/merchant.ts` | extractList 적용 |
| `lib/api/admin.ts` | extractList 적용 |
| `lib/api/products.ts` | extractList 적용 |
| `app/(consumer)/page.tsx` | 찜 목록 병렬 로드 |
| `app/(consumer)/products/[id]/page.tsx` | params Promise + 찜 초기 상태 |
| `app/(consumer)/products/[id]/reserve/page.tsx` | params Promise |
| `app/(consumer)/products/[id]/purchase/page.tsx` | params Promise |
| `app/(merchant)/merchant/products/new/page.tsx` | RESERVATION/FLASH_SALE 분리 |
| `app/(merchant)/merchant/products/page.tsx` | 유형 라벨 |
| `app/(consumer)/mypage/wishlist/page.tsx` | RESERVATION 배지 |
| `lib/mock/*.ts` | GENERAL → RESERVATION |
| `docs/pages.md` | 신규 생성 |

---

## 4. 버그 분류 및 해결 현황

| 심각도 | 이슈 | 원인 | 상태 |
|--------|------|------|------|
| Critical | 찜·상세 페이지 접근 불가 | `proxy.ts` 미들웨어 미인식 | ✅ 수정 |
| Critical | 찜 목록 TypeError (`items.length`) | 백엔드 배열 직접 반환 → `r.content` undefined | ✅ 수정 |
| High | 상품 상세/예약/구매 페이지 오작동 | Next.js 15+ params Promise | ✅ 수정 |
| High | 소상공인/관리자 로그아웃 미동작 | onClick 핸들러 미연결 | ✅ 수정 |
| Medium | 소상공인 레이아웃 콘솔 경고 | locationStore SSR 하이드레이션 불일치 | ✅ 수정 |
| Medium | 찜 초기 상태 항상 false | 상세 진입 시 찜 목록 미조회 | ✅ 수정 |

---

## 5. UX 개선 현황

| 항목 | Before | After |
|------|--------|-------|
| 소상공인 상품 등록 | GENERAL / FLASH_SALE 토글 | RESERVATION / FLASH_SALE 카드 선택 |
| 홈 화면 찜 표시 | 없음 | 카드 우상단 하트 아이콘 (색상 구분) |
| 상세 페이지 찜 버튼 | 항상 "찜하기" 표시 | 실제 상태 반영 (빨간 배경 = 찜됨) |
| 페이지 문서 | 없음 | `docs/pages.md` 17개 페이지 정리 |

---

## 6. 결론

실제 런타임 테스트에서 발견된 Critical 2건, High 2건, Medium 2건 총 6건 버그를 전량 수정.
소상공인 상품 등록 유형을 비즈니스 로직에 맞게 개편하고,
찜 기능의 시각적 피드백을 완성하여 소비자 핵심 UX를 강화.

**현재 상태: 백엔드 연동 기준 모든 주요 흐름 정상 동작.**
