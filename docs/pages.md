# NearPick 페이지 목록

> 모든 URL은 `http://localhost:3000` 기준.
> 백엔드 API: `http://localhost:8080/api`

---

## 인증 (Auth)

| URL | 페이지 | 설명 |
|-----|--------|------|
| `/login` | 로그인 | 이메일 + 비밀번호 로그인. 성공 시 역할에 따라 리다이렉트 (CONSUMER → `/`, MERCHANT → `/merchant/dashboard`, ADMIN → `/admin/users`) |
| `/signup` | 회원가입 | CONSUMER(이메일/비밀번호) 또는 MERCHANT(사업자 정보 추가) 선택 후 가입 |

---

## 소비자 (Consumer)

하단 탭 네비게이션 포함. 로그인된 모든 역할 접근 가능.

| URL | 페이지 | 설명 |
|-----|--------|------|
| `/` | 홈 | 현재 위치 기반 근처 상품 목록. 반경(0.5/1/2/5km) + 정렬(인기순/거리순) 필터. 헤더의 위치 클릭으로 위치 변경 가능 |
| `/products/:id` | 상품 상세 | 상품 정보, 찜하기, 예약하기(RESERVATION) / 선착순 구매(FLASH_SALE) 버튼 |
| `/products/:id/reserve` | 예약하기 | 방문 일정, 수량, 메모 입력 후 예약 생성. RESERVATION 상품 전용 |
| `/products/:id/purchase` | 선착순 구매 | 수량 선택 후 즉시 구매. FLASH_SALE 상품 전용 |
| `/mypage` | 마이페이지 | 회원 번호 + 역할 표시. 찜/예약/구매 메뉴 링크. 로그아웃 버튼 |
| `/mypage/wishlist` | 찜 목록 | 찜한 상품 목록 조회 및 찜 해제 |
| `/mypage/reservations` | 예약 내역 | 내 예약 목록 조회 및 예약 취소 |
| `/mypage/purchases` | 구매 내역 | 선착순 구매 내역 조회 |

---

## 소상공인 (Merchant)

좌측 사이드바 레이아웃. MERCHANT 역할만 접근 가능.

| URL | 페이지 | 설명 |
|-----|--------|------|
| `/merchant/dashboard` | 대시보드 | 이번 달 예약/구매 수, 인기 점수, 내 상품 목록, 최근 대기 예약 확정 |
| `/merchant/products` | 상품 관리 | 등록한 상품 목록 (유형/상태 표시). 상품 종료(CLOSE) 가능 |
| `/merchant/products/new` | 상품 등록 | 유형 선택: **예약 상품**(RESERVATION) / **선착순 구매 상품**(FLASH_SALE). 상품명, 가격, 설명, 수량, 마감 일시 입력 |
| `/merchant/reservations` | 예약 관리 | 소비자 예약 목록 조회. 대기(PENDING) 예약 확정 가능 |

---

## 관리자 (Admin)

좌측 사이드바 레이아웃. ADMIN 역할만 접근 가능.

| URL | 페이지 | 설명 |
|-----|--------|------|
| `/admin/users` | 사용자 관리 | 전체 사용자 목록 (역할/상태 표시). 사용자 정지(SUSPEND) / 탈퇴(DELETE) 처리 |
| `/admin/products` | 상품 검수 | 전체 상품 목록. 상품 강제 종료(FORCE_CLOSE) 처리 |

---

## 라우트 보호 규칙 (`proxy.ts`)

| 규칙 | 설명 |
|------|------|
| 비로그인 → 보호 경로 접근 | `/login` 리다이렉트 |
| 로그인 상태 → `/login`, `/signup` 접근 | 역할별 홈으로 리다이렉트 |
| CONSUMER → `/merchant/*`, `/admin/*` | `/` 리다이렉트 |
| MERCHANT → `/admin/*` | `/merchant/dashboard` 리다이렉트 |
| ADMIN → `/merchant/*` | `/admin/users` 리다이렉트 |

---

## 상품 유형

| ProductType | 라벨 | 소비자 액션 |
|-------------|------|-------------|
| `RESERVATION` | 예약 상품 | 예약하기 → `/products/:id/reserve` |
| `FLASH_SALE` | 선착순 구매 상품 | 선착순 구매 → `/products/:id/purchase` |
