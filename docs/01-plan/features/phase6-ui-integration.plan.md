# Phase 6 — UI Integration Plan

> **Feature**: phase6-ui-integration
> **Phase**: Plan
> **Date**: 2026-03-04
> **Status**: In Progress

---

## 1. Overview

### 1.1 Goal

Phase 5에서 Mock 데이터로 완성한 모든 화면을 실제 백엔드 API와 연동한다.
JWT 기반 인증 흐름과 Geolocation을 포함한 완전한 동작 앱을 구현한다.

### 1.2 Background

| 항목 | 상태 |
|------|------|
| Phase 5 Design System | ✅ 완료 (15개 라우트, Mock 데이터 기반) |
| 백엔드 API | ✅ 동작 중 (`http://localhost:8080/api`) |
| 인증 방식 | JWT (`accessToken` — 로그인 응답에 포함) |
| API 응답 포맷 | `ApiResponse<T>` 래핑 |

### 1.3 Scope

- **포함**: API 클라이언트, 인증 상태 관리, 모든 화면 API 연동, Geolocation
- **제외**: 다크 모드, Pretendard 폰트 전환, 테스트 코드, 배포

---

## 2. Requirements

### 2.1 기능 요구사항

#### FR-01. API 클라이언트 레이어

- `lib/api/` 디렉토리에 도메인별 API 함수 구현
- 모든 요청에 `Authorization: Bearer {accessToken}` 헤더 자동 첨부
- `ApiResponse<T>` 언래핑 — 컴포넌트는 `data`만 받음
- 에러 처리 — 401 시 로그인 페이지로 리다이렉트

#### FR-02. 인증 상태 관리

- 로그인 후 `accessToken`, `userId`, `role` 저장
- 앱 전체에서 인증 상태 접근 가능
- 로그아웃 시 저장된 토큰 제거 + 로그인 페이지 이동
- 페이지 새로고침 후에도 로그인 상태 유지

#### FR-03. 인증 화면 연동 (AUTH)

| 화면 | API | 동작 |
|------|-----|------|
| 로그인 | `POST /api/auth/login` | 성공 시 role에 따라 라우팅 |
| 회원가입 | `POST /api/auth/signup` | 성공 시 로그인 페이지 이동 |

**로그인 후 라우팅**:
- `CONSUMER` → `/` (홈)
- `MERCHANT` → `/merchant/dashboard`
- `ADMIN` → `/admin/users`

#### FR-04. 소비자 화면 연동 (Consumer)

| 화면 | API | 비고 |
|------|-----|------|
| 홈 | `GET /api/products/nearby` | Geolocation으로 lat/lng 획득 |
| 상품 상세 | `GET /api/products/{id}` | |
| 찜 추가/해제 | `POST/DELETE /api/wishlist/{productId}` | 즉시 반영 |
| 예약 생성 | `POST /api/reservations` | 성공 시 예약 내역으로 이동 |
| 선착순 구매 | `POST /api/flash-purchases` | Dialog 확인 후 요청 |
| 찜 목록 | `GET /api/wishlist` | |
| 예약 내역 | `GET /api/reservations` | |
| 구매 내역 | `GET /api/flash-purchases` | |

#### FR-05. 소상공인 화면 연동 (Merchant)

| 화면 | API | 비고 |
|------|-----|------|
| 대시보드 | `GET /api/merchant/dashboard` | |
| 상품 목록 | `GET /api/merchant/products` | |
| 상품 등록 | `POST /api/merchant/products` | 성공 시 상품 목록으로 이동 |
| 상품 종료 | `PATCH /api/merchant/products/{id}/close` | |
| 예약 관리 | `GET /api/merchant/reservations` | |
| 예약 확정 | `PATCH /api/merchant/reservations/{id}/confirm` | |

#### FR-06. 관리자 화면 연동 (Admin)

| 화면 | API | 비고 |
|------|-----|------|
| 사용자 목록 | `GET /api/admin/users` | |
| 사용자 정지 | `PATCH /api/admin/users/{id}/suspend` | |
| 사용자 탈퇴 | `DELETE /api/admin/users/{id}` | |
| 상품 목록 | `GET /api/admin/products` | |
| 상품 강제종료 | `PATCH /api/admin/products/{id}/force-close` | |

#### FR-07. 라우트 보호

- 비로그인 상태에서 보호 라우트 접근 시 `/login`으로 리다이렉트
- 권한 불일치 시 적절한 페이지로 리다이렉트
  - Consumer가 `/merchant/*` 접근 → `/`
  - Merchant가 `/admin/*` 접근 → `/merchant/dashboard`

#### FR-08. Geolocation

- 홈 화면 진입 시 브라우저 Geolocation API로 좌표 획득
- 권한 거부 시 기본 좌표 fallback (서울 중심 — 위도 37.5665, 경도 126.9780)
- ConsumerHeader에 현재 위치명 표시 (좌표 → 주소 변환은 Phase 7 이후)

### 2.2 비기능 요구사항

| 항목 | 기준 |
|------|------|
| 로딩 상태 | API 호출 중 skeleton 또는 spinner 표시 |
| 에러 상태 | API 실패 시 사용자 친화적 메시지 표시 |
| 토큰 저장 | `localStorage` 사용 (httpOnly cookie는 Phase 7 보안 강화 시 검토) |

---

## 3. Technical Decisions

### 3.1 API 클라이언트

**결정**: `fetch` (Next.js 내장) 사용

| 옵션 | 장점 | 단점 |
|------|------|------|
| `fetch` (내장) | 의존성 없음, Next.js 캐싱 호환 | 인터셉터 없음 (직접 구현) |
| `axios` | 인터셉터, 자동 JSON 파싱 | 추가 의존성 |

Next.js App Router 환경에서 `fetch`가 더 자연스럽고 의존성을 최소화한다.

### 3.2 인증 상태 관리

**결정**: Zustand

| 옵션 | 장점 | 단점 |
|------|------|------|
| Zustand | 가볍고 직관적, boilerplate 최소 | 추가 의존성 |
| React Context | 의존성 없음 | re-render 최적화 필요 |
| Redux Toolkit | 강력한 DevTools | 규모 대비 과함 |

### 3.3 라우트 보호

**결정**: Next.js `middleware.ts` (루트 레벨)

- `middleware.ts`에서 쿠키/localStorage 토큰 확인
- `localStorage`는 서버에서 읽을 수 없으므로 토큰을 `cookie`에도 저장

---

## 4. Implementation Order

우선순위 순서:

1. **환경 설정** — `.env.local`, API base URL
2. **API 클라이언트 기반** — `lib/api/client.ts` (fetch wrapper)
3. **Zustand Auth Store** — `lib/store/authStore.ts`
4. **인증 화면** — 로그인, 회원가입 API 연동
5. **미들웨어** — 라우트 보호 (`middleware.ts`)
6. **소비자 화면** — 홈(Geolocation 포함) → 상세 → 찜/예약/구매 → 마이페이지
7. **소상공인 화면** — 대시보드 → 상품 → 예약
8. **관리자 화면** — 사용자 → 상품

---

## 5. Deliverables

| 산출물 | 경로 |
|--------|------|
| API 클라이언트 | `lib/api/client.ts`, `lib/api/*.ts` |
| Auth Store | `lib/store/authStore.ts` |
| 라우트 보호 미들웨어 | `middleware.ts` |
| 환경변수 예시 | `.env.example` |
| 연동 완료 페이지 | 15개 라우트 전체 |

---

## 6. Out of Scope

- 페이지네이션 (백엔드 `PageResponse<T>` 지원 시 Phase 8에서 추가)
- 실시간 업데이트 (WebSocket / SSE)
- 다크 모드 toggle
- Pretendard 폰트 전환
- 단위 테스트 / E2E 테스트
- 프로덕션 배포 (Phase 9)
