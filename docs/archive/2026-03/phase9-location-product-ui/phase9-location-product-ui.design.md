# Design: phase9-location-product-ui

> Phase 9 (Web) — 위치 서비스 + 상품 고도화 UI 반영

## 개요

| 항목 | 내용 |
|------|------|
| **Feature** | phase9-location-product-ui |
| **Phase** | 9 (Web) |
| **목표** | 백엔드 Phase 10 (위치 서비스) + Phase 11 (상품 고도화) API 연동 및 UI 반영 |
| **작성일** | 2026-03-12 |
| **브랜치** | `feature/phase9-location-product-ui` |
| **참조 Plan** | `docs/01-plan/features/phase9-location-product-ui.plan.md` |

---

## 1. 타입 정의 (`types/api.ts`)

### 1.1 신규 타입

```typescript
// ─── Location (Phase 10) ─────────────────────────────
export type LocationSource = 'DIRECT' | 'CURRENT' | 'SAVED'

export interface SavedLocationResponse {
  id: number
  label: string
  lat: number
  lng: number
  isDefault: boolean
  createdAt: string
}

export interface CreateSavedLocationRequest {
  label: string
  lat: number
  lng: number
  isDefault?: boolean
}

export interface UpdateSavedLocationRequest {
  label?: string
  isDefault?: boolean
}

export interface LocationSearchResult {
  address: string
  lat: number
  lng: number
}

// ─── Product Enhancement (Phase 11) ──────────────────
export type ProductCategory = 'FOOD' | 'BEVERAGE' | 'BEAUTY' | 'DAILY' | 'OTHER'

export interface ProductImageResponse {
  id: number
  url: string
  s3Key: string
  displayOrder: number
}

export interface MenuChoiceResponse {
  id: number
  name: string
  additionalPrice: number
  displayOrder: number
}

export interface ProductMenuOptionGroupResponse {
  id: number
  name: string
  required: boolean
  maxSelect: number
  displayOrder: number
  choices: MenuChoiceResponse[]
}

export interface ProductSpecItem {
  key: string
  value: string
}

export interface PresignedUrlRequest {
  filename: string
  contentType: string
}

export interface PresignedUrlResponse {
  presignedUrl: string
  s3Key: string
  expiresInSeconds: number
}

export interface ProductImageSaveRequest {
  s3Key: string
  displayOrder: number
}
```

### 1.2 기존 타입 변경

```typescript
// ProductSummaryResponse — category, thumbnailUrl 추가
export interface ProductSummaryResponse {
  id: number
  title: string
  price: number
  productType: ProductType
  status: ProductStatus
  popularityScore: number
  distanceKm: number
  merchantName: string
  shopAddress: string | null
  shopLat: number
  shopLng: number
  category: ProductCategory | null        // 신규
  thumbnailUrl: string | null             // 신규
}

// ProductDetailResponse — category, images, menuOptions, specs 추가
export interface ProductDetailResponse {
  id: number
  title: string
  description: string | null
  price: number
  productType: ProductType
  status: ProductStatus
  stock: number
  availableFrom: string | null
  availableUntil: string | null
  shopLat: number
  shopLng: number
  shopAddress: string | null
  merchantName: string
  wishlistCount: number
  reservationCount: number
  purchaseCount: number
  category: ProductCategory | null        // 신규
  images: ProductImageResponse[]          // 신규
  menuOptions: ProductMenuOptionGroupResponse[]  // 신규
  specs: ProductSpecItem[] | null         // 신규
}

// CreateProductRequest — category, specs 추가
export interface CreateProductRequest {
  title: string
  description?: string
  price: number
  productType: ProductType
  stock?: number
  availableFrom?: string
  availableUntil?: string
  category?: ProductCategory              // 신규
  specs?: ProductSpecItem[]               // 신규
}
```

---

## 2. API 클라이언트

### 2.1 `lib/api/location.ts` (신규)

```typescript
import { api } from './client'
import type {
  CreateSavedLocationRequest,
  LocationSearchResult,
  SavedLocationResponse,
  UpdateSavedLocationRequest,
} from '@/types/api'

// PATCH /api/consumers/me/location — 현재 위치 갱신
export function updateCurrentLocation(lat: number, lng: number): Promise<void> {
  return api.patch<void>('/consumers/me/location', { lat, lng })
}

// GET /api/consumers/me/locations — 저장 위치 목록
export function getSavedLocations(): Promise<SavedLocationResponse[]> {
  return api.get<SavedLocationResponse[]>('/consumers/me/locations')
}

// POST /api/consumers/me/locations — 저장 위치 추가
export function addSavedLocation(
  body: CreateSavedLocationRequest,
): Promise<SavedLocationResponse> {
  return api.post<SavedLocationResponse>('/consumers/me/locations', body)
}

// PUT /api/consumers/me/locations/{id} — 저장 위치 수정
export function updateSavedLocation(
  id: number,
  body: UpdateSavedLocationRequest,
): Promise<SavedLocationResponse> {
  return api.put<SavedLocationResponse>(`/consumers/me/locations/${id}`, body)
}

// DELETE /api/consumers/me/locations/{id} — 저장 위치 삭제
export function deleteSavedLocation(id: number): Promise<void> {
  return api.delete<void>(`/consumers/me/locations/${id}`)
}

// PATCH /api/consumers/me/locations/{id}/default — 기본 위치 지정
export function setDefaultLocation(id: number): Promise<SavedLocationResponse> {
  return api.patch<SavedLocationResponse>(`/consumers/me/locations/${id}/default`)
}

// GET /api/location/search?query=... — 주소 검색
export function searchAddress(query: string): Promise<LocationSearchResult[]> {
  return api.get<LocationSearchResult[]>(
    `/location/search?query=${encodeURIComponent(query)}`,
  )
}
```

> `api.put`이 `client.ts`에 없으므로 `client.ts`에 `put` 메서드 추가 필요.

### 2.2 `lib/api/productImages.ts` (신규)

```typescript
import type {
  PresignedUrlRequest,
  PresignedUrlResponse,
  ProductImageResponse,
  ProductImageSaveRequest,
} from '@/types/api'

// POST /api/products/{id}/images/presigned — Presigned URL 발급
export function getPresignedUrl(
  productId: number,
  body: PresignedUrlRequest,
): Promise<PresignedUrlResponse> {
  return api.post<PresignedUrlResponse>(`/products/${productId}/images/presigned`, body)
}

// S3 직접 업로드 (인증 헤더 없이 Presigned URL로 PUT)
export async function uploadToS3(presignedUrl: string, file: File): Promise<void> {
  const res = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  })
  if (!res.ok) throw new Error('이미지 업로드에 실패했습니다.')
}

// POST /api/products/{id}/images — URL 저장
export function saveImageUrl(
  productId: number,
  body: ProductImageSaveRequest,
): Promise<ProductImageResponse> {
  return api.post<ProductImageResponse>(`/products/${productId}/images`, body)
}

// DELETE /api/products/{id}/images/{imageId} — 이미지 삭제
export function deleteImage(productId: number, imageId: number): Promise<void> {
  return api.delete<void>(`/products/${productId}/images/${imageId}`)
}
```

### 2.3 `lib/api/products.ts` 수정

```typescript
// 기존 getNearbyProducts 시그니처 변경
export function getNearbyProducts(params: {
  lat?: number
  lng?: number
  radius: number
  sort?: SortType
  locationSource?: LocationSource
  savedLocationId?: number
  category?: ProductCategory
}): Promise<ProductSummaryResponse[]>
```

내부적으로 URLSearchParams로 쿼리 구성:
- `locationSource=DIRECT`이면 `lat`, `lng` 추가
- `locationSource=SAVED`이면 `savedLocationId` 추가
- `category`가 있으면 추가
- `locationSource=CURRENT`이면 lat/lng 없이 파라미터만

### 2.4 `lib/api/client.ts` — `put` 메서드 추가

```typescript
export const api = {
  // ... 기존 get, post, patch, delete
  put<T>(path: string, body?: unknown): Promise<T> {
    return apiRequest<T>(path, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  },
}
```

### 2.5 `lib/api/merchant.ts` — `createProduct` 수정

`CreateProductRequest` 타입에 `category`, `specs`가 추가되면 자동 반영 (타입 변경만으로 충분).

---

## 3. 상태 관리 (`lib/store/locationStore.ts`)

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LocationSource } from '@/types/api'

export interface Location {
  lat: number
  lng: number
  displayName: string
}

const DEFAULT_LOCATION: Location = {
  lat: 37.5665,
  lng: 126.978,
  displayName: '서울 중구',
}

interface LocationState {
  location: Location
  locationSource: LocationSource            // 신규: 기본값 'DIRECT'
  savedLocationId: number | null            // 신규: SAVED 선택 시 ID

  setLocation: (location: Location) => void
  setGpsLocation: (lat: number, lng: number) => void
  setLocationSource: (                      // 신규
    source: LocationSource,
    savedLocationId?: number,
  ) => void
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      location: DEFAULT_LOCATION,
      locationSource: 'DIRECT',
      savedLocationId: null,

      setLocation(location) {
        set({ location, locationSource: 'DIRECT', savedLocationId: null })
      },

      setGpsLocation(lat, lng) {
        set({
          location: { lat, lng, displayName: '내 위치' },
          locationSource: 'CURRENT',
          savedLocationId: null,
        })
      },

      setLocationSource(source, savedLocationId) {
        set({ locationSource: source, savedLocationId: savedLocationId ?? null })
      },
    }),
    { name: 'nearpick-location' },
  ),
)
```

---

## 4. 컴포넌트 설계

### 4.1 `components/features/product/CategoryBadge.tsx` (신규)

```typescript
interface CategoryBadgeProps {
  category: ProductCategory
  size?: 'sm' | 'md'
}
```

| category | 라벨 | 색상 |
|----------|------|------|
| FOOD | 음식 | `bg-orange-100 text-orange-700` |
| BEVERAGE | 음료 | `bg-blue-100 text-blue-700` |
| BEAUTY | 뷰티 | `bg-pink-100 text-pink-700` |
| DAILY | 생활 | `bg-green-100 text-green-700` |
| OTHER | 기타 | `bg-gray-100 text-gray-600` |

shadcn `<Badge>` 커스텀 variant 대신 className으로 직접 적용.

---

### 4.2 `components/features/product/ProductCard.tsx` 수정

변경점:
- 이미지 영역: `thumbnailUrl` 있으면 `<img>` / 없으면 기존 placeholder
- 카드 하단: `category` 있으면 `<CategoryBadge>` 표시 (distanceKm 줄 옆 또는 아래)

```tsx
// 이미지 영역
<div className="relative aspect-square bg-gray-100 ...">
  {product.thumbnailUrl ? (
    <img
      src={product.thumbnailUrl}
      alt={product.title}
      className="w-full h-full object-cover"
    />
  ) : (
    <span className="flex items-center justify-center w-full h-full text-gray-300 text-sm">
      이미지 없음
    </span>
  )}
  {/* 찜 버튼 (기존 유지) */}
  {/* category 배지 */}
  {product.category && (
    <div className="absolute bottom-2 left-2">
      <CategoryBadge category={product.category} size="sm" />
    </div>
  )}
</div>
```

---

### 4.3 `components/features/product/ImageGallery.tsx` (신규)

```typescript
interface ImageGalleryProps {
  images: ProductImageResponse[]
}
```

- `images.length === 0`: `aspect-video bg-muted` placeholder ("이미지 없음") 유지
- `images.length >= 1`: 가로 스크롤 슬라이더
  - 현재 인덱스 상태 (`useState<number>`)
  - `<button>` 좌우 화살표로 이동
  - 하단 dot indicator
  - `overflow-hidden` + `transform: translateX` 방식

```tsx
// 구조
<div className="relative aspect-video w-full overflow-hidden bg-muted">
  <div
    className="flex h-full transition-transform duration-300"
    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
  >
    {images.map((img) => (
      <img
        key={img.id}
        src={img.url}
        alt=""
        className="w-full h-full object-cover shrink-0"
      />
    ))}
  </div>
  {/* 화살표 버튼 (images.length > 1) */}
  {/* dot indicator */}
</div>
```

---

### 4.4 `components/features/product/MenuOptionSection.tsx` (신규)

```typescript
interface MenuOptionSectionProps {
  menuOptions: ProductMenuOptionGroupResponse[]
}
```

- 각 그룹: 그룹명 + (필수/선택) 태그 + choices 목록
- 선택 기능은 이번 범위 외 — 표시 전용 (읽기 모드)

```tsx
<div className="space-y-4">
  <h2 className="font-semibold text-sm">메뉴 옵션</h2>
  {menuOptions.map((group) => (
    <div key={group.id} className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{group.name}</span>
        <Badge variant={group.required ? 'destructive' : 'secondary'} className="text-xs">
          {group.required ? '필수' : '선택'}
        </Badge>
      </div>
      <ul className="space-y-1 pl-2">
        {group.choices.map((choice) => (
          <li key={choice.id} className="flex justify-between text-sm text-muted-foreground">
            <span>{choice.name}</span>
            {choice.additionalPrice > 0 && (
              <span>+{formatPrice(choice.additionalPrice)}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>
```

---

### 4.5 `components/features/product/SpecsSection.tsx` (신규)

```typescript
interface SpecsSectionProps {
  specs: ProductSpecItem[]
}
```

```tsx
<div className="space-y-2">
  <h2 className="font-semibold text-sm">상품 정보</h2>
  <dl className="divide-y divide-border">
    {specs.map((spec, i) => (
      <div key={i} className="flex justify-between py-2 text-sm">
        <dt className="text-muted-foreground">{spec.key}</dt>
        <dd className="font-medium">{spec.value}</dd>
      </div>
    ))}
  </dl>
</div>
```

---

### 4.6 `components/features/product/ImageUploader.tsx` (신규)

```typescript
interface ImageUploaderProps {
  productId: number
  onUploaded: (image: ProductImageResponse) => void
  currentCount: number   // 현재 이미지 수 (최대 5장 체크)
}
```

업로드 플로우:
```
1. <input type="file" accept="image/jpeg,image/png,image/webp"> 선택
2. getPresignedUrl(productId, { filename, contentType })
3. presignedUrl이 localhost:8080/mock-upload/* → uploadToS3 skip, s3Key만 사용
   presignedUrl이 S3 URL → uploadToS3(presignedUrl, file)
4. saveImageUrl(productId, { s3Key, displayOrder: currentCount })
5. onUploaded(savedImage) 콜백
```

mock 모드 감지:
```typescript
const isMockUrl = (url: string) => url.includes('localhost') || url.includes('mock-upload')
```

UI:
- 파일 선택 버튼 (`+` 아이콘)
- 업로드 중: Spinner
- 에러: `text-destructive` 메시지
- 최대 5장 초과 시 버튼 비활성화

---

### 4.7 `components/features/location/AddLocationModal.tsx` (신규)

```typescript
interface AddLocationModalProps {
  open: boolean
  onClose: () => void
  onAdded: (location: SavedLocationResponse) => void
}
```

플로우:
```
1. 검색어 입력 (debounce 500ms) → searchAddress(query)
2. 결과 목록 표시 (최대 5건)
3. 결과 클릭 → label 입력 필드 노출 (기본값: address 앞 20자)
4. isDefault 체크박스
5. 저장 → addSavedLocation({ label, lat, lng, isDefault })
6. 성공 시 onAdded(result) 호출
```

UI 구조:
```tsx
<Dialog open={open} onOpenChange={onClose}>
  <DialogContent>
    <DialogHeader>위치 추가</DialogHeader>
    {/* 검색 인풋 */}
    <Input placeholder="주소 검색..." value={query} onChange={...} />
    {/* 검색 결과 목록 */}
    {results.map((r) => (
      <button onClick={() => selectResult(r)}>{r.address}</button>
    ))}
    {/* 선택 후: label 입력 + isDefault 체크 */}
    {selected && (
      <>
        <Input value={label} onChange={...} placeholder="라벨 (예: 집, 회사)" />
        <Checkbox checked={isDefault} onCheckedChange={...} /> 기본 위치로 설정
        <Button onClick={handleSave}>저장</Button>
      </>
    )}
  </DialogContent>
</Dialog>
```

---

### 4.8 `components/features/location/SavedLocationList.tsx` (신규)

```typescript
interface SavedLocationListProps {
  locations: SavedLocationResponse[]
  onSetDefault: (id: number) => void
  onDelete: (id: number) => void
  loading?: boolean
}
```

```tsx
<ul className="divide-y divide-border">
  {locations.map((loc) => (
    <li key={loc.id} className="flex items-center gap-3 py-3">
      <MapPin className={loc.isDefault ? 'text-primary' : 'text-muted-foreground'} />
      <div className="flex-1">
        <p className="text-sm font-medium">{loc.label}</p>
        {loc.isDefault && <p className="text-xs text-primary">기본 위치</p>}
      </div>
      {!loc.isDefault && (
        <Button size="sm" variant="ghost" onClick={() => onSetDefault(loc.id)}>
          기본 설정
        </Button>
      )}
      <Button size="sm" variant="ghost" onClick={() => onDelete(loc.id)}>
        <Trash2 className="w-4 h-4 text-destructive" />
      </Button>
    </li>
  ))}
</ul>
```

---

## 5. 페이지 설계

### 5.1 홈 페이지 (`app/(consumer)/page.tsx`) 수정

**추가 상태**:
```typescript
const [category, setCategory] = useState<ProductCategory | null>(null)
const { locationSource, savedLocationId, savedLocations } = ...
// savedLocations: SAVED 선택 시 드롭다운용 (최초 로드)
```

**locationSource 선택 UI** (ConsumerHeader 아래, 반경/정렬 위):
```tsx
<div className="flex gap-2 overflow-x-auto pb-1">
  <button
    onClick={handleSelectDirect}
    className={cn('... shrink-0', locationSource === 'DIRECT' && 'border-primary text-primary')}
  >
    <MapPin className="w-3.5 h-3.5" />
    {location.displayName}
  </button>
  <button
    onClick={handleSelectCurrent}
    className={cn('...', locationSource === 'CURRENT' && 'border-primary text-primary')}
  >
    <Navigation className="w-3.5 h-3.5" />
    현재위치
  </button>
  {/* 저장 위치 드롭다운 (로그인 상태에서만) */}
  <Select onValueChange={handleSelectSaved}>
    <SelectTrigger className="h-8 text-xs shrink-0 w-28">
      <SelectValue placeholder="저장 위치" />
    </SelectTrigger>
    <SelectContent>
      {savedLocations.map((loc) => (
        <SelectItem key={loc.id} value={String(loc.id)}>{loc.label}</SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
```

**category 필터 탭**:
```tsx
const CATEGORY_TABS = [
  { value: null, label: '전체' },
  { value: 'FOOD', label: '음식' },
  { value: 'BEVERAGE', label: '음료' },
  { value: 'BEAUTY', label: '뷰티' },
  { value: 'DAILY', label: '생활' },
]

<Tabs value={category ?? 'ALL'} onValueChange={(v) => setCategory(v === 'ALL' ? null : v as ProductCategory)}>
  <TabsList className="h-8 w-full overflow-x-auto">
    {CATEGORY_TABS.map((t) => (
      <TabsTrigger key={String(t.value)} value={t.value ?? 'ALL'} className="text-xs">
        {t.label}
      </TabsTrigger>
    ))}
  </TabsList>
</Tabs>
```

**handleSelectCurrent** 플로우:
```typescript
async function handleSelectCurrent() {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude: lat, longitude: lng } = pos.coords
    try {
      await updateCurrentLocation(lat, lng)  // 서버 갱신 (로그인 시에만)
    } catch { /* 비로그인 무시 */ }
    setLocationSource('CURRENT')
    setGpsLocation(lat, lng)
  })
}
```

**getNearbyProducts 호출**:
```typescript
getNearbyProducts({
  lat: locationSource === 'DIRECT' ? location.lat : undefined,
  lng: locationSource === 'DIRECT' ? location.lng : undefined,
  radius,
  sort,
  locationSource,
  savedLocationId: locationSource === 'SAVED' ? savedLocationId ?? undefined : undefined,
  category: category ?? undefined,
})
```

---

### 5.2 상품 상세 페이지 (`app/(consumer)/products/[id]/page.tsx`) 수정

**변경 사항**:
1. `<ImageGallery images={product.images} />` — 기존 placeholder 대체
2. 상품명 옆 `{product.category && <CategoryBadge category={product.category} />}`
3. `product.menuOptions.length > 0` → `<MenuOptionSection menuOptions={product.menuOptions} />`
4. `product.specs && product.specs.length > 0` → `<SpecsSection specs={product.specs} />`

**레이아웃 순서**:
```
ImageGallery
  └─ 이미지 갤러리 (or placeholder)
상품 기본 정보 영역
  └─ 상품명 + CategoryBadge
  └─ 가격
  └─ 주소, 판매자명
Separator
통계 (찜/예약/구매)
재고 배지 (FLASH_SALE)
Separator
상품 설명
MenuOptionSection (FOOD/BEVERAGE + menuOptions 있을 때)
SpecsSection (specs 있을 때)
Separator
액션 버튼 (찜, 예약, 선착순 구매)
```

---

### 5.3 상품 등록 페이지 (`app/(merchant)/merchant/products/new/page.tsx`) 수정

**추가 상태**:
```typescript
const [category, setCategory] = useState<ProductCategory | null>(null)
const [specs, setSpecs] = useState<{ key: string; value: string }[]>([])
const [uploadedImages, setUploadedImages] = useState<ProductImageResponse[]>([])
const [createdProductId, setCreatedProductId] = useState<number | null>(null)
```

**단계별 플로우 변경**:
- 기존: 폼 제출 → 완료 → 이동
- 변경: 폼 제출 → 상품 생성 → 이미지 업로드 단계 → 완료 → 이동

**카테고리 선택 Card** (기본 정보 카드 아래):
```tsx
<Card>
  <CardHeader><CardTitle className="text-base">카테고리 (선택)</CardTitle></CardHeader>
  <CardContent>
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setCategory(category === value ? null : value)}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm border transition-colors',
            category === value
              ? 'bg-primary text-white border-primary'
              : 'bg-card border-border hover:bg-muted',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  </CardContent>
</Card>
```

**스펙 입력 Card** (BEAUTY/DAILY/OTHER 선택 시 노출):
```tsx
{(category === 'BEAUTY' || category === 'DAILY' || category === 'OTHER') && (
  <Card>
    <CardHeader><CardTitle className="text-base">상품 정보 (스펙)</CardTitle></CardHeader>
    <CardContent className="space-y-2">
      {specs.map((spec, i) => (
        <div key={i} className="flex gap-2">
          <Input placeholder="항목 (예: 용량)" value={spec.key} onChange={...} />
          <Input placeholder="값 (예: 200ml)" value={spec.value} onChange={...} />
          <Button type="button" variant="ghost" onClick={() => removeSpec(i)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addSpec} className="w-full text-sm">
        + 항목 추가
      </Button>
    </CardContent>
  </Card>
)}
```

**이미지 업로드 Card** (상품 생성 완료 후 표시):
```
상품 생성 성공(createdProductId 세팅)
  → "이미지 업로드" Card 표시
  → ImageUploader (최대 5장)
  → "다음" 버튼 → /merchant/products 이동
```

```tsx
{createdProductId ? (
  <Card>
    <CardHeader><CardTitle className="text-base">상품 이미지 (선택)</CardTitle></CardHeader>
    <CardContent>
      {/* 업로드된 이미지 미리보기 */}
      <div className="grid grid-cols-3 gap-2">
        {uploadedImages.map((img) => (
          <img key={img.id} src={img.url} className="aspect-square object-cover rounded" />
        ))}
      </div>
      {uploadedImages.length < 5 && (
        <ImageUploader
          productId={createdProductId}
          currentCount={uploadedImages.length}
          onUploaded={(img) => setUploadedImages((prev) => [...prev, img])}
        />
      )}
      <Button className="w-full mt-4" onClick={() => router.push('/merchant/products')}>
        완료
      </Button>
    </CardContent>
  </Card>
) : (
  /* 기존 폼 + submit 버튼 */
)}
```

---

### 5.4 저장 위치 관리 페이지 (`app/(consumer)/mypage/locations/page.tsx`) 신규

```typescript
'use client'

// 상태
const [locations, setLocations] = useState<SavedLocationResponse[]>([])
const [loading, setLoading] = useState(true)
const [addModalOpen, setAddModalOpen] = useState(false)
```

**데이터 로드**: `getSavedLocations()` on mount

**액션**:
- 기본 위치 지정: `setDefaultLocation(id)` → `setLocations` 업데이트
- 삭제: `deleteSavedLocation(id)` → `setLocations` 필터
- 추가: `AddLocationModal` → `onAdded` 콜백 → `setLocations` append

**레이아웃**:
```
PageHeader("저장 위치 관리", showBack)
{/* 저장 위치 목록 */}
SavedLocationList
  locations=[...]
  onSetDefault={...}
  onDelete={...}
{/* 추가 버튼 (최대 5개 미만일 때) */}
<Button onClick={() => setAddModalOpen(true)}>위치 추가</Button>
<p className="text-xs text-muted-foreground">최대 5개까지 저장 가능</p>
AddLocationModal open={addModalOpen} onAdded={handleAdded} onClose={...}
```

---

### 5.5 마이페이지 (`app/(consumer)/mypage/page.tsx`) 수정

```typescript
// MY_MENU에 저장 위치 항목 추가 (로그인 CONSUMER만)
const MY_MENU = [
  { href: '/mypage/wishlist', icon: Heart, label: '찜 목록' },
  { href: '/mypage/reservations', icon: Calendar, label: '예약 내역' },
  { href: '/mypage/purchases', icon: ShoppingBag, label: '구매 내역' },
  { href: '/mypage/locations', icon: MapPin, label: '저장 위치 관리' },  // 신규
]
```

CONSUMER role이 아닌 경우(`role !== 'CONSUMER'`) 저장 위치 항목 숨김:
```typescript
const visibleMenu = MY_MENU.filter(
  (item) => item.href !== '/mypage/locations' || role === 'CONSUMER',
)
```

---

## 6. 파일 변경 목록 (전체)

| 파일 | 변경 유형 | 주요 내용 |
|------|-----------|-----------|
| `types/api.ts` | **수정** | 신규 타입 추가, 기존 타입 필드 추가 |
| `lib/api/client.ts` | **수정** | `put` 메서드 추가 |
| `lib/api/products.ts` | **수정** | `getNearbyProducts` 파라미터 객체화 |
| `lib/api/merchant.ts` | 수정 없음 | `CreateProductRequest` 타입 변경으로 자동 반영 |
| `lib/api/location.ts` | **신규** | 위치 CRUD + 주소 검색 |
| `lib/api/productImages.ts` | **신규** | Presigned URL + 이미지 저장/삭제 |
| `lib/store/locationStore.ts` | **수정** | `locationSource`, `savedLocationId` 추가 |
| `components/features/product/CategoryBadge.tsx` | **신규** | 카테고리 배지 |
| `components/features/product/ProductCard.tsx` | **수정** | thumbnailUrl, category 배지 |
| `components/features/product/ImageGallery.tsx` | **신규** | 이미지 슬라이더 |
| `components/features/product/MenuOptionSection.tsx` | **신규** | 메뉴 옵션 표시 |
| `components/features/product/SpecsSection.tsx` | **신규** | 스펙 속성 표시 |
| `components/features/product/ImageUploader.tsx` | **신규** | Presigned URL 업로드 |
| `components/features/location/SavedLocationList.tsx` | **신규** | 저장 위치 목록 |
| `components/features/location/AddLocationModal.tsx` | **신규** | 주소 검색 + 위치 추가 |
| `app/(consumer)/page.tsx` | **수정** | locationSource UI, category 탭 |
| `app/(consumer)/products/[id]/page.tsx` | **수정** | 이미지, 카테고리, 메뉴옵션, 스펙 |
| `app/(consumer)/mypage/page.tsx` | **수정** | 저장 위치 메뉴 추가 |
| `app/(consumer)/mypage/locations/page.tsx` | **신규** | 저장 위치 관리 페이지 |
| `app/(merchant)/merchant/products/new/page.tsx` | **수정** | category, specs, 이미지 업로드 |

총 **신규 10개**, **수정 9개**, 삭제 0개

---

## 7. 구현 순서

```
Step 1.  types/api.ts — 신규/수정 타입 전체 반영
Step 2.  lib/api/client.ts — put 메서드 추가
Step 3.  lib/api/location.ts — 신규
Step 4.  lib/api/productImages.ts — 신규
Step 5.  lib/api/products.ts — getNearbyProducts 파라미터 객체화
Step 6.  lib/store/locationStore.ts — locationSource, savedLocationId 추가
Step 7.  CategoryBadge 컴포넌트 신규
Step 8.  ProductCard 수정 (thumbnailUrl + CategoryBadge)
Step 9.  ImageGallery 컴포넌트 신규
Step 10. MenuOptionSection 컴포넌트 신규
Step 11. SpecsSection 컴포넌트 신규
Step 12. 상품 상세 페이지 수정 (ImageGallery + CategoryBadge + MenuOptionSection + SpecsSection)
Step 13. 홈 페이지 수정 (locationSource UI + category 탭)
Step 14. ImageUploader 컴포넌트 신규
Step 15. 상품 등록 페이지 수정 (category + specs + ImageUploader)
Step 16. SavedLocationList 컴포넌트 신규
Step 17. AddLocationModal 컴포넌트 신규
Step 18. /mypage/locations 페이지 신규
Step 19. 마이페이지 수정 (저장 위치 메뉴)
Step 20. pnpm build — 타입 오류 없음 확인
```

---

## 8. 성공 기준

| 항목 | 기준 |
|------|------|
| pnpm build | 타입 오류 없이 빌드 성공 |
| locationSource=DIRECT | 기존 lat/lng 방식으로 nearby 호출 |
| locationSource=CURRENT | GPS 획득 → 서버 갱신 → `locationSource=CURRENT`로 nearby 호출 |
| locationSource=SAVED | 저장 위치 선택 → `locationSource=SAVED&savedLocationId=N`으로 nearby 호출 |
| category 필터 | 탭 선택 시 `category=FOOD` 등 파라미터 포함, 전체 탭은 category 없음 |
| ProductCard 이미지 | `thumbnailUrl` 있으면 실제 이미지, 없으면 placeholder |
| ProductCard category | category 배지 표시 |
| 상품 상세 이미지 갤러리 | images 배열 기반 슬라이더, 없으면 placeholder |
| 상품 상세 메뉴 옵션 | FOOD/BEVERAGE 상품에 menuOptions 표시 (표시 전용) |
| 상품 상세 스펙 | specs 있을 때 key-value 목록 표시 |
| 이미지 업로드 (mock) | `product.image.upload.enabled=false` 환경에서도 업로드 완료 |
| 저장 위치 목록 | `/mypage/locations`에서 목록/추가/삭제/기본설정 동작 |
| 주소 검색 | `AddLocationModal`에서 카카오 주소 검색 결과 표시 |
