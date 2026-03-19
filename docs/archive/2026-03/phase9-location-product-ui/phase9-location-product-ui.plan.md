# Plan: phase9-location-product-ui

> Phase 9 (Web) — 위치 서비스 + 상품 고도화 UI 반영

## 개요

| 항목 | 내용 |
|------|------|
| **Feature** | phase9-location-product-ui |
| **Phase** | 9 (Web) |
| **목표** | 백엔드 Phase 10 (위치 서비스) + Phase 11 (상품 고도화) API 변경사항을 프론트엔드에 반영 |
| **작성일** | 2026-03-12 |
| **브랜치 예정** | `feature/phase9-location-product-ui` |
| **참조 백엔드** | `near-pick/docs/archive/2026-03/phase10-location/`, `near-pick/docs/01-plan/features/phase11-product-enhancement.plan.md` |

---

## 배경 및 목적

백엔드에서 두 가지 주요 고도화가 완료됐다:

1. **Phase 10 — 위치 서비스**: GPS 현재위치 갱신, 저장 위치 CRUD, 카카오 주소 검색, `locationSource` 파라미터로 nearby 상품 조회 방식 다양화
2. **Phase 11 — 상품 고도화**: 카테고리 체계(FOOD/BEVERAGE/BEAUTY/DAILY/OTHER), S3 이미지 업로드, 음식 메뉴 옵션, 비음식 스펙 속성

현재 프론트엔드는 이 변경사항을 전혀 반영하지 않은 상태다:
- `types/api.ts`에 새 타입 없음
- `lib/api/products.ts`의 `getNearbyProducts`가 `locationSource`, `category` 미지원
- 위치 관련 API 클라이언트(`lib/api/location.ts`) 없음
- 상품 상세 페이지에 이미지, 메뉴 옵션, specs, category 미표시
- 상품 카드(`ProductCard`)가 썸네일 이미지 미표시 (placeholder만)
- 상품 등록 폼에 category, 이미지 업로드 없음
- 마이페이지에 저장 위치 관리 없음

---

## 목표 기능

### 기능 1. 타입 + API 클라이언트 업데이트

`types/api.ts` 신규 타입:
- `LocationSource`: `'DIRECT' | 'CURRENT' | 'SAVED'`
- `SavedLocationResponse`: 저장 위치 응답 (id, label, lat, lng, isDefault, createdAt)
- `CreateSavedLocationRequest`, `UpdateSavedLocationRequest`
- `LocationSearchResult`: 카카오 주소 검색 결과 (address, lat, lng)
- `ProductCategory`: `'FOOD' | 'BEVERAGE' | 'BEAUTY' | 'DAILY' | 'OTHER'`
- `ProductImageResponse`: 이미지 (id, url, s3Key, displayOrder)
- `MenuChoiceResponse`, `ProductMenuOptionGroupResponse`: 메뉴 옵션
- `ProductSpecItem`: `{ key: string; value: string }`
- `PresignedUrlRequest`, `PresignedUrlResponse`

`types/api.ts` 기존 타입 변경:
- `ProductSummaryResponse` — `category: ProductCategory | null`, `thumbnailUrl: string | null` 추가
- `ProductDetailResponse` — `category`, `images`, `menuOptions`, `specs` 추가
- `CreateProductRequest` — `category`, `specs` 추가

신규 파일:
- `lib/api/location.ts` — 위치 CRUD + 주소 검색 API
- `lib/api/productImages.ts` — Presigned URL, 이미지 저장/삭제/순서변경

기존 파일 수정:
- `lib/api/products.ts` — `getNearbyProducts`에 `locationSource`, `savedLocationId`, `category` 파라미터 추가

---

### 기능 2. 홈 페이지 — locationSource + category 필터

**현재**: lat/lng 직접 전달 only, sort + radius만 필터

**변경**:
- `locationSource` 선택 UI: 현재위치(GPS) / 저장위치(저장된 주소) / 직접입력
  - `CURRENT`: 브라우저 Geolocation으로 GPS 획득 → `PATCH /api/consumers/me/location` 서버 갱신 → `locationSource=CURRENT`로 nearby 조회
  - `SAVED`: 저장 위치 목록 드롭다운 → `locationSource=SAVED&savedLocationId={id}`로 조회
  - `DIRECT`: 기존 방식 (locationStore의 lat/lng 직접 전달)
- **category 필터 탭**: 전체 / 음식 / 음료 / 뷰티 / 생활용품
- locationStore에 `locationSource`, `savedLocationId` 상태 추가

---

### 기능 3. 상품 카드 — 썸네일 이미지

**현재**: 회색 placeholder "이미지" 텍스트만 표시

**변경**:
- `thumbnailUrl`이 있으면 `<img>` 태그로 실제 이미지 표시
- 없으면 기존 placeholder 유지
- category 배지 (FOOD: 🍽 음식, BEVERAGE: ☕ 음료 등) 카드 우하단에 표시

---

### 기능 4. 상품 상세 페이지 — 이미지·카테고리·메뉴옵션·스펙

**현재**: "이미지" placeholder, category/images/menuOptions/specs 미표시

**변경**:
- **이미지 갤러리**: `images` 배열 기반 가로 스크롤 이미지 슬라이더 (없으면 placeholder 유지)
- **카테고리 배지**: 상품명 옆에 category 배지 표시
- **메뉴 옵션 UI** (FOOD/BEVERAGE 상품): 옵션 그룹별 선택 UI, 추가 금액 표시, 필수/선택 표시 — *구매/예약 플로우 반영은 이번 범위 제외, 표시만*
- **스펙 속성** (BEAUTY/DAILY/OTHER 상품): key-value 목록 표시

---

### 기능 5. 소상공인 상품 등록 — category + 이미지 업로드

**현재**: title, description, price, productType, stock, availableUntil만 입력 가능

**변경**:
- **카테고리 선택**: 5개 카테고리 버튼 그룹 (optional)
- **이미지 업로드** (상품 등록 완료 후): Presigned URL 발급 → 브라우저에서 S3 직접 PUT → URL 저장 플로우
  - 최대 5장, 허용 확장자: jpg/jpeg/png/webp
  - Local mock 모드(백엔드 `product.image.upload.enabled=false`)에서도 정상 동작
- **스펙 입력** (BEAUTY/DAILY/OTHER): key-value 동적 추가/삭제 UI

메뉴 옵션(FOOD/BEVERAGE) 등록 UI는 이번 범위 제외 (복잡도 높음, 별도 phase).

---

### 기능 6. 마이페이지 — 저장 위치 관리

**현재**: 찜목록/예약내역/구매내역 메뉴만 있음

**변경**:
- 마이페이지에 "저장 위치 관리" 메뉴 추가 (`/mypage/locations`)
- `/mypage/locations` 페이지 (신규):
  - 저장 위치 목록 표시 (최대 5개), 기본 위치 표시
  - 추가: 카카오 주소 검색(`GET /api/location/search`) → 결과 선택 → label 입력 → 저장
  - 기본 위치 지정 버튼
  - 삭제 버튼
- 비로그인 시 위치 관리 메뉴 숨김

---

## 범위 (In / Out of Scope)

### In Scope

| 항목 | 이유 |
|------|------|
| `types/api.ts` 타입 업데이트 | 모든 하위 기능의 기반 |
| `lib/api/location.ts` 신규 | 위치 API 연동 필수 |
| `lib/api/productImages.ts` 신규 | 이미지 업로드 연동 필수 |
| `lib/api/products.ts` 파라미터 확장 | locationSource, category 지원 |
| 홈 페이지 locationSource UI + category 탭 | Phase 10/11 핵심 UX |
| ProductCard 썸네일 이미지 + category 배지 | 상품 탐색 UX 개선 |
| 상품 상세 이미지 갤러리 + category + specs + 메뉴옵션 표시 | Phase 11 핵심 |
| 상품 등록 category 선택 + 이미지 업로드 + specs 입력 | 소상공인 UX 필수 |
| 마이페이지 저장 위치 관리 페이지 | Phase 10 소비자 UX |
| locationStore 업데이트 | locationSource 상태 관리 |

### Out of Scope

| 항목 | 이유 |
|------|------|
| 메뉴 옵션 등록 UI (소상공인) | 복잡도 높음, 별도 phase |
| 메뉴 옵션 선택 → 예약/구매 금액 반영 | 별도 phase |
| 이미지 순서 변경 drag & drop | 구현 복잡도 높음, 후순위 |
| 카카오 지도 렌더링 | 이번 범위 외 |
| GPS 현재위치 자동 갱신 (주기적) | 향후 고도화 |

---

## 기술 방향

### 파일 구조 (신규/수정)

```
types/
  api.ts                            ← 수정 (타입 추가/변경)

lib/
  api/
    location.ts                     ← 신규
    productImages.ts                ← 신규
    products.ts                     ← 수정 (파라미터 확장)
    merchant.ts                     ← 수정 (CreateProductRequest category/specs)
  store/
    locationStore.ts                ← 수정 (locationSource, savedLocationId 상태)

app/
  (consumer)/
    page.tsx                        ← 수정 (locationSource UI, category 탭)
    products/[id]/page.tsx          ← 수정 (이미지, category, menuOptions, specs)
    mypage/
      locations/page.tsx            ← 신규
      page.tsx                      ← 수정 (저장 위치 메뉴 추가)

  (merchant)/
    merchant/
      products/new/page.tsx         ← 수정 (category, 이미지 업로드, specs)

components/
  features/
    product/ProductCard.tsx         ← 수정 (썸네일, category 배지)
    location/
      SavedLocationList.tsx         ← 신규 (저장 위치 목록)
      AddLocationModal.tsx          ← 신규 (주소 검색 + 위치 추가)
    product/
      ImageGallery.tsx              ← 신규 (상품 이미지 슬라이더)
      MenuOptionSection.tsx         ← 신규 (메뉴 옵션 표시)
      SpecsSection.tsx              ← 신규 (스펙 속성 표시)
      ImageUploader.tsx             ← 신규 (Presigned URL 업로드)
      CategoryBadge.tsx             ← 신규 (카테고리 배지)
```

### locationStore 변경

```typescript
interface LocationState {
  location: { lat: number; lng: number }         // 기존
  locationSource: LocationSource                  // 신규
  savedLocationId: number | null                  // 신규
  setLocation: (lat: number, lng: number) => void // 기존
  setLocationSource: (source: LocationSource, savedLocationId?: number) => void  // 신규
}
```

### 이미지 업로드 플로우

```
1. POST /api/products/{id}/images/presigned → { presignedUrl, s3Key }
2. PUT presignedUrl (브라우저 → S3 직접)
3. POST /api/products/{id}/images { s3Key, displayOrder } → { url }
```

Local mock 모드: `presignedUrl`이 `http://localhost:8080/mock-upload/...` 형태 → 실제 PUT 대신 `displayOrder`만 증가시켜 URL 저장 단계로 진행 (또는 mock URL 그대로 저장).

---

## 예상 파일 변경 목록

### 신규 파일

| 파일 | 설명 |
|------|------|
| `lib/api/location.ts` | 위치 CRUD + 주소 검색 API |
| `lib/api/productImages.ts` | 이미지 Presigned URL + 저장/삭제 |
| `app/(consumer)/mypage/locations/page.tsx` | 저장 위치 관리 페이지 |
| `components/features/location/SavedLocationList.tsx` | 저장 위치 목록 컴포넌트 |
| `components/features/location/AddLocationModal.tsx` | 주소 검색 + 위치 추가 모달 |
| `components/features/product/ImageGallery.tsx` | 상품 이미지 갤러리 |
| `components/features/product/MenuOptionSection.tsx` | 메뉴 옵션 표시 |
| `components/features/product/SpecsSection.tsx` | 스펙 속성 표시 |
| `components/features/product/ImageUploader.tsx` | 이미지 업로드 (Presigned URL) |
| `components/features/product/CategoryBadge.tsx` | 카테고리 배지 |

### 수정 파일

| 파일 | 변경 내용 |
|------|-----------|
| `types/api.ts` | LocationSource, SavedLocation 관련, ProductCategory, ProductImage, MenuOption, Spec 타입 추가; ProductSummaryResponse/ProductDetailResponse/CreateProductRequest 수정 |
| `lib/api/products.ts` | `getNearbyProducts` — locationSource, savedLocationId, category 파라미터 추가 |
| `lib/api/merchant.ts` | `createProduct` — category, specs 파라미터 추가 |
| `lib/store/locationStore.ts` | locationSource, savedLocationId 상태 추가 |
| `app/(consumer)/page.tsx` | locationSource 선택 UI, category 필터 탭 |
| `app/(consumer)/products/[id]/page.tsx` | 이미지 갤러리, category 배지, 메뉴 옵션, specs |
| `app/(consumer)/mypage/page.tsx` | 저장 위치 관리 메뉴 추가 |
| `app/(merchant)/merchant/products/new/page.tsx` | category 선택, 이미지 업로드, specs 입력 |
| `components/features/product/ProductCard.tsx` | thumbnailUrl 이미지 표시, category 배지 |

---

## 성공 기준

| 항목 | 기준 |
|------|------|
| 타입 안전성 | `types/api.ts` 변경 후 `pnpm build` 오류 없음 |
| locationSource 동작 | 홈 페이지에서 DIRECT/CURRENT/SAVED 선택 시 각각 올바른 파라미터로 nearby API 호출 |
| category 필터 | 탭 선택 시 해당 category로 nearby 필터링, "전체" 선택 시 전체 조회 |
| 상품 카드 이미지 | thumbnailUrl 있는 상품은 실제 이미지 표시 |
| 상품 상세 이미지 갤러리 | images 배열 기반 슬라이더 표시, 없으면 placeholder |
| 상품 상세 메뉴 옵션 | FOOD/BEVERAGE 상품에 menuOptions 표시 |
| 상품 상세 스펙 | BEAUTY/DAILY/OTHER 상품에 specs 표시 |
| 이미지 업로드 | 상품 등록 후 이미지 업로드 가능 (mock 모드 포함) |
| 저장 위치 관리 | 추가/삭제/기본위치 지정 동작 |
| 주소 검색 | AddLocationModal에서 카카오 주소 검색 결과 표시 |
| pnpm build | 타입 오류 없이 빌드 성공 |

---

## 구현 순서

```
Step 1. types/api.ts 업데이트 (타입 추가/변경)
Step 2. lib/api/location.ts 신규
Step 3. lib/api/productImages.ts 신규
Step 4. lib/api/products.ts 수정 (파라미터 확장)
Step 5. lib/api/merchant.ts 수정 (category, specs)
Step 6. lib/store/locationStore.ts 수정
Step 7. CategoryBadge 컴포넌트 신규
Step 8. ProductCard 수정 (thumbnailUrl, category 배지)
Step 9. ImageGallery 컴포넌트 신규
Step 10. MenuOptionSection 컴포넌트 신규
Step 11. SpecsSection 컴포넌트 신규
Step 12. 상품 상세 페이지 수정
Step 13. 홈 페이지 수정 (locationSource UI, category 탭)
Step 14. ImageUploader 컴포넌트 신규
Step 15. 상품 등록 페이지 수정 (category, 이미지, specs)
Step 16. AddLocationModal 컴포넌트 신규
Step 17. SavedLocationList 컴포넌트 신규
Step 18. /mypage/locations 페이지 신규
Step 19. 마이페이지 메뉴 수정
Step 20. pnpm build 검증
```

---

## 의존성 확인

- [x] Phase 10 (백엔드): ConsumerLocationController, LocationController, ProductController (locationSource) — 완료
- [x] Phase 11 (백엔드): ProductImageController, ProductMenuOptionController, ProductEntity (category, specs) — 완료
- [x] Phase 6 (Web): API 클라이언트 레이어, auth 상태관리 — 완료
- [ ] 카카오 REST API 키 (`NEXT_PUBLIC_KAKAO_API_KEY`) — 환경변수 필요 (미설정 시 주소 검색 기능 비활성화)
- [ ] 백엔드 S3 mock 모드 실행 (`product.image.upload.enabled=false`) — 로컬 개발 시 필수

---

## 다음 단계

```
/pdca design phase9-location-product-ui
```
