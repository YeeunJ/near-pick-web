# Plan: phase7-integration-qa

## 개요

Phase 6에서 구현한 UI ↔ Spring Boot 백엔드 API 연동의 실제 동작을 검증한다.
정적 코드 분석과 서버 런타임 테스트를 병행해 문제를 조기에 발견하고 수정한다.

- **대상 레포**: `near-pick-web` (프론트엔드)
- **연동 대상**: `near-pick` 백엔드 (Spring Boot, `http://localhost:8080`)
- **목표**: "실제로 눌러도 동작하는" 상태 확인 및 문제 목록 도출

---

## 목적

| # | 목표 |
|---|------|
| 1 | API 엔드포인트 URL / HTTP 메서드 / payload shape이 백엔드 스펙과 일치하는지 확인 |
| 2 | 인증 흐름(로그인 → 토큰 저장 → 보호 경로 접근)이 end-to-end로 동작하는지 확인 |
| 3 | 각 역할(CONSUMER / MERCHANT / ADMIN)의 주요 사용자 시나리오가 정상 동작하는지 확인 |
| 4 | UI 레벨에서 에러 처리가 사용자에게 적절히 보이는지 확인 |
| 5 | 발견된 문제를 우선순위별로 문서화하고 수정 |

---

## 검증 범위

### 1단계 — 정적 코드 분석 (서버 불필요)

| 검증 항목 | 확인 방법 |
|-----------|-----------|
| API 엔드포인트 URL 일치 | `lib/api/*.ts` vs `CLAUDE.md` 스펙 대조 |
| HTTP 메서드 일치 | GET/POST/PATCH/DELETE 메서드 확인 |
| 요청 payload shape | `types/api.ts` 요청 타입 vs 백엔드 DTO |
| 응답 타입 처리 | `ApiResponse<T>` unwrap 후 타입 활용 방식 |
| 인증 헤더 | `Authorization: Bearer {token}` 누락 경로 확인 |
| 토큰 쿠키 이름 | proxy.ts의 쿠키명 vs authStore의 저장 키 일치 |

### 2단계 — 런타임 동작 확인 (두 서버 모두 실행)

#### AUTH 흐름
- [ ] 회원가입 → 로그인 → 역할별 리다이렉트
- [ ] 비로그인 상태에서 보호 경로 접근 → `/login` 리다이렉트
- [ ] 로그인 상태에서 `/login` 접근 → 역할 홈으로 리다이렉트
- [ ] 새로고침 후 인증 상태 유지 (AuthInitializer 검증)

#### CONSUMER 흐름
- [ ] 홈(`/`): 위치 기반 상품 목록 로드
- [ ] 상품 상세(`/products/[id]`): 상세 정보 + 찜 토글
- [ ] 예약(`/products/[id]/reserve`): 폼 제출 → 예약 생성
- [ ] 선착순 구매(`/products/[id]/purchase`): 구매 확정
- [ ] 찜 목록(`/mypage/wishlist`): 목록 로드 + 찜 해제
- [ ] 예약 목록(`/mypage/reservations`): 목록 로드 + 예약 취소
- [ ] 구매 내역(`/mypage/purchases`): 목록 로드

#### MERCHANT 흐름
- [ ] 대시보드(`/merchant/dashboard`): 통계 + 대기 예약 목록
- [ ] 상품 관리(`/merchant/products`): 목록 로드 + 상품 종료
- [ ] 상품 등록(`/merchant/products/new`): 일반/선착순 폼 제출
- [ ] 예약 관리(`/merchant/reservations`): 목록 로드 + 예약 확정

#### ADMIN 흐름
- [ ] 사용자 관리(`/admin/users`): 목록 로드 + 정지/탈퇴
- [ ] 상품 검수(`/admin/products`): 목록 로드 + 강제종료

---

## 접근 방법

### 정적 분석
- `lib/api/*.ts` 전체 코드를 `CLAUDE.md` 엔드포인트 스펙과 직접 대조
- 타입 불일치, 경로 오류, 메서드 오류를 코드 레벨에서 식별

### 런타임 테스트
- `pnpm dev` (포트 3000) + Spring Boot (포트 8080) 동시 실행
- 브라우저 Network 탭으로 실제 요청/응답 확인
- 콘솔 에러 및 UI 상태 확인

### 문제 분류 기준
| 심각도 | 기준 |
|--------|------|
| Critical | 기능이 완전히 동작하지 않음 (API 호출 실패, 인증 불가 등) |
| High | 주요 흐름이 비정상 (잘못된 리다이렉트, 데이터 미표시 등) |
| Medium | 부분적 오동작 (낙관적 업데이트 오류, 에러 메시지 미표시 등) |
| Low | UI/UX 개선 사항 (아이콘, 문구 등) |

---

## 산출물

1. **정적 분석 보고서**: 엔드포인트/타입 불일치 목록
2. **런타임 이슈 목록**: 시나리오별 발견된 버그 및 심각도
3. **수정 코드**: Critical/High 이슈 즉시 수정
4. **분석 문서**: `docs/03-analysis/phase7-integration-qa.analysis.md`

---

## 구현 순서

1. 정적 분석 실행 → 이슈 목록 작성
2. Critical/High 이슈 즉시 수정
3. 런타임 시나리오 테스트 → 추가 이슈 발견
4. 나머지 이슈 수정 및 재확인
5. 분석 문서 작성 및 PR 생성

---

## 제약 조건

- 백엔드 코드 수정 없음 (프론트엔드 코드만 수정)
- 테스트 스크립트 미사용 (Zero Script QA 방식)
- 발견된 모든 Critical/High 이슈는 이 phase 내에서 수정 완료
