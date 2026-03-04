# near-pick-web

> NearPick 프론트엔드 — 지역 기반 실시간 인기 상품 커머스 플랫폼

소비자는 근처 인기 상품을 탐색하고 찜·예약·선착순 구매를 할 수 있으며,
소상공인은 상품과 할인권을 등록해 노출·판매한다. 모든 거래는 **직접 방문 수령** 기반이다.

**백엔드**: [`near-pick`](../near-pick) (Spring Boot) — API 명세, 도메인 문서, 개발 가이드는 해당 레포 참고

---

## Tech Stack

| 항목 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui v3 (new-york style) |
| Package Manager | pnpm |

---

## Project Structure

```
near-pick-web/
├── app/
│   ├── (auth)/           # 로그인, 회원가입
│   ├── (consumer)/       # 홈, 상품 상세, 예약, 선착순 구매, 마이페이지
│   ├── (merchant)/       # 소상공인 대시보드, 상품 관리, 예약 관리
│   └── (admin)/          # 관리자 사용자·상품 관리
├── components/
│   ├── ui/               # shadcn/ui + 커스텀 컴포넌트
│   ├── layout/           # ConsumerHeader, BottomNav, MerchantSidebar, AdminSidebar
│   └── features/         # StatusBadge, ProductCard
├── lib/
│   ├── utils.ts          # cn, formatPrice, formatDate
│   └── mock/             # 목업 데이터 (Phase 5 — API 연동 전)
└── types/
    └── api.ts            # 백엔드 DTO와 1:1 대응 타입 정의
```

---

## Getting Started

### 사전 요구사항

- Node.js 20 이상
- pnpm
- 백엔드 서버 실행 중 (`http://localhost:8080`) → [`near-pick`](../near-pick) 참고

### 설치 및 실행

```bash
pnpm install
pnpm dev
```

브라우저에서 <http://localhost:3000> 접속

### 빌드

```bash
pnpm build
pnpm start
```

---

## Backend API

백엔드는 [`near-pick`](../near-pick) 레포에서 관리한다.

- Base URL: `http://localhost:8080/api`
- 모든 응답은 `ApiResponse<T>` 형태로 래핑됨
- API 명세, 도메인 모델, 개발 가이드는 해당 레포의 [`docs/`](../near-pick/docs) 참고

---

## Design System

### NearPick 브랜드 색상

| Token | Hex | 용도 |
|-------|-----|------|
| `bg-primary` / `text-primary` | `#1A8C5A` | CTA 버튼, 강조 텍스트 |
| `bg-primary-light` | `#ECF9F3` | 연한 그린 배경 |
| `bg-flash` / `text-flash` | `#FF6B35` | FLASH 배지 |
| `bg-surface` | `#F8F7F4` | 앱 배경 |

> Tailwind v4 사용 — `tailwind.config.ts` 없이 `globals.css`의 `@theme inline`으로 색상 정의

---

## Phase Progress

| Phase | 상태 | 설명 |
|-------|------|------|
| Phase 5 — Design System | ✅ 완료 | 목업 데이터 기반 UI 구현 |
| Phase 6 — UI Integration | 🔄 진행 예정 | 백엔드 API 실제 연동 |

---

## License

Private repository — all rights reserved.
