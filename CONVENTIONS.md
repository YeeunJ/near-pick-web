# NearPick Web Coding Conventions

> 이 문서는 near-pick-web 프로젝트의 모든 코드 작성 기준입니다.
> near-pick(백엔드)의 컨벤션과 같은 방향성을 유지합니다.

---

## 1. 프로젝트 구조

```
app/                  ← Next.js App Router 라우트 및 레이아웃
components/
├── ui/               ← shadcn/ui 컴포넌트 (자동 생성 + 커스텀)
├── layout/           ← 공통 레이아웃 컴포넌트
└── features/         ← 도메인별 기능 컴포넌트
lib/
├── api/              ← API 클라이언트 레이어 (Phase 6~)
├── mock/             ← Mock 데이터 (Phase 5)
└── utils.ts          ← 공통 유틸 함수
types/
└── api.ts            ← 백엔드 DTO와 1:1 싱크 타입 정의
```

### 레이어 규칙

| 레이어 | 위치 | 책임 |
|--------|------|------|
| Pages | `app/` | 라우팅, 레이아웃, 데이터 fetch |
| Components | `components/` | UI 렌더링 — 비즈니스 로직 포함 금지 |
| API Client | `lib/api/` | 서버 통신, 에러 처리 |
| Utils | `lib/utils.ts` | 순수 함수 (부수효과 없음) |
| Types | `types/` | 타입 정의만 — 로직 포함 금지 |

---

## 2. 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase.tsx | `ProductCard.tsx`, `ConsumerHeader.tsx` |
| 페이지 파일 | Next.js 규칙 (`page.tsx`) | `page.tsx`, `layout.tsx` |
| 유틸/훅/API 파일 | camelCase.ts | `utils.ts`, `useAuth.ts`, `productApi.ts` |
| 폴더 | kebab-case | `flash-sale/`, `my-page/` |
| React 컴포넌트 | PascalCase | `ProductCard`, `EmptyState` |
| 함수/변수 | camelCase | `formatPrice()`, `isLoading` |
| 상수 | UPPER_SNAKE_CASE | `NAV_ITEMS`, `MAX_RADIUS_KM` |
| 타입/인터페이스 | PascalCase | `ProductSummaryResponse`, `UserRole` |
| Enum 값 | UPPER_SNAKE_CASE | `FLASH_SALE`, `FORCE_CLOSED` |

---

## 3. TypeScript 규칙

- `strict: true` 유지 — `any` 사용 금지
- import는 항상 `@/` alias 사용 (상대 경로 금지)
- 타입 import는 `import type` 사용
- 백엔드 DTO 타입은 `types/api.ts`에 집중 관리 — 컴포넌트에 인라인 타입 선언 금지

```tsx
// Good
import type { ProductSummaryResponse } from '@/types/api'
import { formatPrice } from '@/lib/utils'

// Bad
import { ProductSummaryResponse } from '../../types/api'
```

---

## 4. 컴포넌트 규칙

- Server Component 기본, 인터랙션 필요 시에만 `'use client'` 추가
- props 타입은 컴포넌트 파일 내 `interface {Name}Props` 로 정의
- 컴포넌트 내 비즈니스 로직 금지 — API 호출은 `lib/api/`, 상태 관리는 별도 훅으로 분리

```tsx
// Good
interface ProductCardProps {
  product: ProductSummaryResponse
}

export function ProductCard({ product }: ProductCardProps) { ... }

// Bad — default export
export default function ProductCard(...) { ... }
```

---

## 5. Git 커밋 규칙

백엔드와 동일한 형식 사용:

```
{type}({scope}): {subject}
```

### 타입

| 타입 | 용도 |
|------|------|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `docs` | 문서 변경 |
| `refactor` | 리팩토링 |
| `style` | UI/CSS 변경 (기능 변경 없음) |
| `test` | 테스트 추가/수정 |
| `chore` | 빌드/설정 변경 |

### 스코프

| 스코프 | 해당 경로 |
|--------|----------|
| `app` | `app/` 라우트, 레이아웃 |
| `components` | `components/` |
| `lib` | `lib/` |
| `types` | `types/` |
| `config` | 루트 설정 파일 |
| `phase-N` | Phase 단위 작업 |

예시:
```
feat(phase6): add API client layer with axios
feat(components): add ProductCard with wishlist toggle
fix(app): resolve hydration mismatch in consumer layout
chore(config): update pnpm dependencies
docs(phase5): add design system completion report
```

---

## 6. 브랜치 전략

백엔드와 동일한 구조:

```
main                              ← 항상 빌드 가능한 안정 브랜치
└── feature/phase-N-{name}        ← Phase 단위 작업 브랜치
```

- `main`은 직접 커밋 금지 — 반드시 PR을 통해 머지
- 브랜치는 항상 최신 `main`에서 생성
- 머지 완료 후 브랜치 삭제 (로컬 + 원격)

### 브랜치 네이밍

| 패턴 | 용도 | 예시 |
|------|------|------|
| `feature/phase-N-{name}` | Phase 단위 개발 | `feature/phase6-api-integration` |
| `feature/{domain}-{desc}` | Phase 내 개별 기능 | `feature/auth-zustand-store` |
| `fix/{desc}` | 버그 수정 | `fix/consumer-layout-hydration` |
| `docs/{desc}` | 문서만 변경 | `docs/update-conventions` |
| `chore/{desc}` | 빌드/설정 변경 | `chore/upgrade-nextjs` |
| `refactor/{desc}` | 리팩토링 | `refactor/product-api-client` |

---

## 7. PR 컨벤션

### PR 제목

커밋 메시지와 동일한 형식:

```
{type}({scope}): {subject}
```

예시:
```
feat(phase6): implement API integration with JWT auth
fix(components): correct ProductCard price display
chore(phase5): establish design system conventions
```

### PR 규칙

| 규칙 | 내용 |
|------|------|
| 대상 브랜치 | `main`으로만 PR |
| 제목 | 커밋 컨벤션 형식 준수 |
| 빌드 | PR 생성 전 `pnpm build` 로컬 통과 확인 |
| 머지 방식 | Merge commit (스쿼시 X — 커밋 히스토리 보존) |

### PR 본문 구조

```markdown
## Summary
2-3줄 요약

## Changes
- 변경된 파일/컴포넌트 목록

## Test Plan
- [ ] `pnpm build` 통과
- [ ] 주요 화면 브라우저 확인

## Related
관련 Phase, 문서, 이슈

## Checklist
- [ ] 커밋 컨벤션 준수
- [ ] `pnpm build` 성공
- [ ] TypeScript 에러 없음
- [ ] CONVENTIONS.md 준수
```

---

## 8. 빌드 & 타입 체크

PR 생성 전 필수 확인:

```bash
# 타입 체크 + 빌드
pnpm build

# 개발 서버 (확인용)
pnpm dev
```

빌드 에러 또는 TypeScript 에러가 있는 상태로 PR 금지.
