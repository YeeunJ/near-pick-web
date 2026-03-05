# phase7-integration-qa Analysis Report

> **Analysis Type**: Gap Analysis (Plan vs Implementation - Static Code Analysis)
>
> **Project**: near-pick-web
> **Version**: 0.1.0
> **Analyst**: Claude (gap-detector)
> **Date**: 2026-03-05
> **Plan Doc**: [phase7-integration-qa.plan.md](../01-plan/features/phase7-integration-qa.plan.md)

---

## 1. Analysis Overview

### 1.1 Analysis Purpose

Phase 7 Plan의 "1단계 -- 정적 코드 분석" 체크리스트에 따라 프론트엔드 코드가 백엔드 API 스펙과 일치하는지 검증한다. 이전 분석(v0.1)에서 발견된 C-1~C-14, H-1~H-8 이슈가 모두 수정되었는지 확인한다.

### 1.2 Analysis Scope

- **Plan Document**: `docs/01-plan/features/phase7-integration-qa.plan.md`
- **Implementation Path**: `lib/api/`, `types/api.ts`, `app/`, `proxy.ts`, `lib/store/authStore.ts`
- **Previous Analysis**: v0.1 (2026-03-05) -- 13 Critical, 8 High issues found
- **Analysis Date**: 2026-03-05 (v0.2 -- post-fix verification)

---

## 2. Plan Checklist Verification

### 2.1 API Endpoint URL Match (`lib/api/*.ts` vs Backend Spec)

#### AUTH

| Backend Endpoint | Frontend Code | File | Status |
|------------------|---------------|------|--------|
| `POST /api/auth/login` | `api.post('/auth/login', body)` | `lib/api/auth.ts:5` | ✅ Match |
| `POST /api/auth/signup/consumer` | `api.post('/auth/signup/consumer', body)` | `lib/api/auth.ts:11` | ✅ Match |
| `POST /api/auth/signup/merchant` | `api.post('/auth/signup/merchant', body)` | `lib/api/auth.ts:15` | ✅ Match |

#### Products

| Backend Endpoint | Frontend Code | File | Status |
|------------------|---------------|------|--------|
| `GET /api/products/nearby?lat=&lng=&radius=&sort=` | `api.get('/products/nearby?lat=...&lng=...&radius=...&sort=...')` | `lib/api/products.ts:10-14` | ✅ Match |
| `GET /api/products/{id}` | `api.get('/products/${id}')` | `lib/api/products.ts:18` | ✅ Match |

#### Wishlist

| Backend Endpoint | Frontend Code | File | Status |
|------------------|---------------|------|--------|
| `GET /api/wishlists/me` | `api.get('/wishlists/me')` | `lib/api/wishlist.ts:5` | ✅ Match |
| `POST /api/wishlists` body: `{productId}` | `api.post('/wishlists', { productId })` | `lib/api/wishlist.ts:9` | ✅ Match |
| `DELETE /api/wishlists/{productId}` | `api.delete('/wishlists/${productId}')` | `lib/api/wishlist.ts:13` | ✅ Match |

#### Reservations

| Backend Endpoint | Frontend Code | File | Status |
|------------------|---------------|------|--------|
| `POST /api/reservations` | `api.post('/reservations', body)` | `lib/api/reservations.ts:5` | ✅ Match |
| `GET /api/reservations/me` | `api.get('/reservations/me')` | `lib/api/reservations.ts:9` | ✅ Match |
| `PATCH /api/reservations/{id}/cancel` | `api.patch('/reservations/${id}/cancel')` | `lib/api/reservations.ts:13` | ✅ Match |

#### Flash Purchases

| Backend Endpoint | Frontend Code | File | Status |
|------------------|---------------|------|--------|
| `POST /api/flash-purchases` | `api.post('/flash-purchases', body)` | `lib/api/flashPurchases.ts:5` | ✅ Match |
| `GET /api/flash-purchases/me` | `api.get('/flash-purchases/me')` | `lib/api/flashPurchases.ts:9` | ✅ Match |

#### Merchant

| Backend Endpoint | Frontend Code | File | Status |
|------------------|---------------|------|--------|
| `GET /api/merchants/me/dashboard` | `api.get('/merchants/me/dashboard')` | `lib/api/merchant.ts:12` | ✅ Match |
| `GET /api/products/me` | `api.get('/products/me')` | `lib/api/merchant.ts:16` | ✅ Match |
| `POST /api/products` | `api.post('/products', body)` | `lib/api/merchant.ts:20` | ✅ Match |
| `PATCH /api/products/{id}/close` | `api.patch('/products/${id}/close')` | `lib/api/merchant.ts:24` | ✅ Match |
| `GET /api/reservations/merchant` | `api.get('/reservations/merchant')` | `lib/api/merchant.ts:28` | ✅ Match |
| `PATCH /api/reservations/{id}/confirm` | `api.patch('/reservations/${id}/confirm')` | `lib/api/merchant.ts:32` | ✅ Match |

#### Admin

| Backend Endpoint | Frontend Code | File | Status |
|------------------|---------------|------|--------|
| `GET /api/admin/users` | `api.get('/admin/users...')` | `lib/api/admin.ts:14` | ✅ Match |
| `PATCH /api/admin/users/{id}/suspend` | `api.patch('/admin/users/${id}/suspend')` | `lib/api/admin.ts:18` | ✅ Match |
| `DELETE /api/admin/users/{id}` | `api.delete('/admin/users/${id}')` | `lib/api/admin.ts:22` | ✅ Match |
| `GET /api/admin/products` | `api.get('/admin/products...')` | `lib/api/admin.ts:27` | ✅ Match |
| `PATCH /api/admin/products/{id}/force-close` | `api.patch('/admin/products/${id}/force-close')` | `lib/api/admin.ts:31` | ✅ Match |

**Endpoint URL: 23/23 (100%)**

### 2.2 HTTP Method Match

| Endpoint | Expected Method | Actual Method | Status |
|----------|----------------|---------------|--------|
| Login | POST | POST | ✅ |
| Signup Consumer | POST | POST | ✅ |
| Signup Merchant | POST | POST | ✅ |
| Nearby Products | GET | GET | ✅ |
| Product Detail | GET | GET | ✅ |
| Wishlist List | GET | GET | ✅ |
| Wishlist Add | POST | POST | ✅ |
| Wishlist Remove | DELETE | DELETE | ✅ |
| Create Reservation | POST | POST | ✅ |
| My Reservations | GET | GET | ✅ |
| Cancel Reservation | PATCH | PATCH | ✅ |
| Create Flash Purchase | POST | POST | ✅ |
| My Flash Purchases | GET | GET | ✅ |
| Merchant Dashboard | GET | GET | ✅ |
| My Products (Merchant) | GET | GET | ✅ |
| Create Product | POST | POST | ✅ |
| Close Product | PATCH | PATCH | ✅ |
| Merchant Reservations | GET | GET | ✅ |
| Confirm Reservation | PATCH | PATCH | ✅ |
| Admin Users | GET | GET | ✅ |
| Suspend User | PATCH | PATCH | ✅ |
| Delete User | DELETE | DELETE | ✅ |
| Admin Products | GET | GET | ✅ |
| Force Close Product | PATCH | PATCH | ✅ |

**HTTP Methods: 24/24 (100%)**

### 2.3 Request Payload Shape (`types/api.ts` vs Backend DTO)

| Request Type | Field | types/api.ts | Backend DTO | Status |
|-------------|-------|-------------|-------------|--------|
| `LoginRequest` | email, password | ✅ `email: string; password: string` | ✅ | ✅ Match |
| `SignupConsumerRequest` | email, password | ✅ `email: string; password: string` | ✅ | ✅ Match |
| `SignupMerchantRequest` | email, password, businessName, businessRegNo, shopAddress, shopLat, shopLng | ✅ All 7 fields present | ✅ | ✅ Match |
| `CreateReservationRequest` | productId, visitScheduledAt?, quantity, memo? | ✅ Matches backend | ✅ | ✅ Match |
| `CreateFlashPurchaseRequest` | productId, quantity | ✅ | ✅ | ✅ Match |
| `CreateProductRequest` | title, description?, price, productType, stock?, availableFrom?, availableUntil? | ✅ Uses `stock` and `availableUntil` | ✅ | ✅ Match |

**Request Payloads: 6/6 (100%)**

### 2.4 Response Type / ApiResponse<T> Unwrapping

| Check Item | Implementation | Status |
|------------|---------------|--------|
| `ApiResponse<T>` wrapper type defined | `types/api.ts:158-162`: `{ success: boolean; data: T; error: string \| null }` | ✅ |
| JSON parsed as `ApiResponse<T>` | `client.ts:61`: `const json: ApiResponse<T> = await res.json()` | ✅ |
| `success` field checked | `client.ts:63-65`: `if (!json.success) throw ...` | ✅ |
| `json.data` extracted and returned | `client.ts:67`: `return json.data` | ✅ |
| Error message from `json.error` | `client.ts:64`: uses `json.error` | ✅ |
| Login response: JWT-only handling | `auth.ts:5-7`: receives `{ accessToken }`, then `decodeJwt()` for userId/role | ✅ |
| `PageResponse<T>` handling | All list endpoints use `.then(r => r.content)` to extract array from paginated response | ✅ |

**Response Handling: 7/7 (100%)**

### 2.5 Authorization Header (Bearer Token)

| Check Item | Implementation | Status |
|------------|---------------|--------|
| Token retrieval from localStorage | `client.ts:20-23`: `getToken()` reads `localStorage.getItem('accessToken')` | ✅ |
| Authorization header format | `client.ts:36-38`: `headers['Authorization'] = 'Bearer ${token}'` | ✅ |
| Conditional (only when token exists) | `client.ts:36`: `if (token)` guard | ✅ |
| 401 response handling | `client.ts:42-49`: clears token/cookies, redirects to `/login` | ✅ |
| Server-side guard (`typeof window`) | `client.ts:21`: `if (typeof window === 'undefined') return null` | ✅ |

**Auth Header: 5/5 (100%)**

### 2.6 Token Cookie Name Consistency (proxy.ts vs authStore)

| Cookie Name | proxy.ts | authStore | Status |
|-------------|----------|-----------|--------|
| `token` | `request.cookies.get('token')` (line 14) | `setCookie('token', ...)` (line 32) | ✅ Match |
| `role` | `request.cookies.get('role')` (line 15) | `setCookie('role', ...)` (line 33) | ✅ Match |

Logout cleanup also consistent:
- `authStore.logout()` calls `removeCookie('token')` and `removeCookie('role')`
- `client.ts` 401 handler: `document.cookie = 'token=; max-age=0; path=/'` and `document.cookie = 'role=; max-age=0; path=/'`

**Cookie Consistency: 2/2 (100%)**

---

## 3. Previous Issues Verification (v0.1 -> v0.2)

### 3.1 Critical Issues (C-1 ~ C-14): All Fixed

| Issue | Description | Fix Applied | Status |
|-------|-------------|-------------|--------|
| C-1 | Signup consumer path | `/auth/signup/consumer` | ✅ Fixed |
| C-2 | Signup merchant path | `/auth/signup/merchant` | ✅ Fixed |
| C-3 | Wishlist list path | `/wishlists/me` | ✅ Fixed |
| C-4 | Wishlist add method | `POST /wishlists` with body | ✅ Fixed |
| C-5 | Wishlist remove path | `/wishlists/{productId}` | ✅ Fixed |
| C-6 | Reservations list path | `/reservations/me` | ✅ Fixed |
| C-7 | Reservation cancel method | `PATCH /reservations/{id}/cancel` | ✅ Fixed |
| C-8 | Flash purchases list path | `/flash-purchases/me` | ✅ Fixed |
| C-9 | Dashboard path | `/merchants/me/dashboard` | ✅ Fixed |
| C-10 | Merchant products path | `/products/me` | ✅ Fixed |
| C-11 | Product create path | `/products` | ✅ Fixed |
| C-12 | Product close path | `/products/{id}/close` | ✅ Fixed |
| C-13 | Merchant reservations path | `/reservations/merchant` | ✅ Fixed |
| C-14 | Reservation confirm path | `/reservations/{id}/confirm` | ✅ Fixed |

### 3.2 High Issues (H-1 ~ H-8): All Fixed

| Issue | Description | Fix Applied | Status |
|-------|-------------|-------------|--------|
| H-1 | Login response: JWT decode | `decodeJwt()` extracts `sub`/`role` from JWT payload | ✅ Fixed |
| H-2 | ReservationItem fields | `reservationId`, `visitScheduledAt`, `memo` -- all match | ✅ Fixed |
| H-3 | FlashPurchaseItem fields | `purchaseId` -- matches | ✅ Fixed |
| H-4 | WishlistItem fields | `productTitle`, `productPrice`, `productType`, `productStatus`, `shopAddress` | ✅ Fixed |
| H-5 | ProductSummaryResponse fields | `merchantName`, `shopAddress`, `shopLat`, `shopLng` added | ✅ Fixed |
| H-6 | ProductDetailResponse fields | `availableUntil`, `stock`, `merchantName` -- all match | ✅ Fixed |
| H-7 | MerchantDashboardResponse | `businessName`, `thisMonthReservationCount/PurchaseCount`, `products: ProductListItem[]`, `recentReservations` | ✅ Fixed |
| H-8 | CreateProductRequest fields | `stock`, `availableUntil`, `description?` optional | ✅ Fixed |

### 3.3 Backend Issues (B-1 ~ B-6): All Fixed (per task description)

| Issue | Status |
|-------|--------|
| B-1: AdminProductItem fields | ✅ Fixed (backend) |
| B-2: WishlistItem status/shopAddress | ✅ Fixed (backend) |
| B-3: ProductSummaryResponse location fields | ✅ Fixed (backend) |
| B-4: MerchantDashboard recentReservations | ✅ Fixed (backend) |
| B-5: ReservationItem memo | ✅ Fixed (backend) |
| B-6: Signup naming convention | ✅ Fixed (backend) |

---

## 4. Page-Level Integration Verification

### 4.1 All Pages Using Correct API Functions

| Page | Route | API Functions Used | Fields Consumed Correctly | Status |
|------|-------|--------------------|--------------------------|--------|
| Login | `/login` | `login()` from `lib/api/auth` | `accessToken`, `userId`, `role` via `LoginResult` | ✅ |
| Signup | `/signup` | `signupConsumer()`, `signupMerchant()` | Role-based branching, merchant extra fields | ✅ |
| Consumer Home | `/` | `getNearbyProducts()` | `ProductSummaryResponse` fields (id, title, price, etc.) | ✅ |
| Product Detail | `/products/[id]` | `getProductDetail()`, `addWishlist()`, `removeWishlist()` | Uses `stock`, `merchantName`, `shopAddress`, `availableUntil` | ✅ |
| Reserve | `/products/[id]/reserve` | `getProductDetail()`, `createReservation()` | `visitScheduledAt`, `quantity`, `memo` | ✅ |
| Purchase | `/products/[id]/purchase` | `getProductDetail()`, `createFlashPurchase()` | `stock`, `productId`, `quantity` | ✅ |
| Wishlist | `/mypage/wishlist` | `getWishlist()`, `removeWishlist()` | `wishlistId`, `productId`, `productTitle`, `productPrice`, `shopAddress`, `productType`, `productStatus` | ✅ |
| Reservations | `/mypage/reservations` | `getReservations()`, `cancelReservation()` | `reservationId`, `productTitle`, `visitScheduledAt`, `quantity`, `memo`, `status` | ✅ |
| Purchases | `/mypage/purchases` | `getFlashPurchases()` | `purchaseId`, `productTitle`, `purchasedAt`, `quantity`, `status` | ✅ |
| Merchant Dashboard | `/merchant/dashboard` | `getMerchantDashboard()`, `confirmReservation()` | `businessName`, `thisMonthReservationCount`, `thisMonthPurchaseCount`, `totalPopularityScore`, `products`, `recentReservations` | ✅ |
| Merchant Products | `/merchant/products` | `getMerchantProducts()`, `closeProduct()` | `ProductListItem` fields | ✅ |
| New Product | `/merchant/products/new` | `createProduct()` | `title`, `description`, `price`, `productType`, `stock`, `availableUntil` | ✅ |
| Merchant Reservations | `/merchant/reservations` | `getMerchantReservations()`, `confirmReservation()` | `ReservationItem` fields, `ReservationStatusResponse` | ✅ |
| Admin Users | `/admin/users` | `getAdminUsers()`, `suspendUser()`, `deleteUser()` | `userId`, `email`, `role`, `status`, `createdAt` | ✅ |
| Admin Products | `/admin/products` | `getAdminProducts()`, `forceCloseProduct()` | `productId`, `title`, `price`, `merchantName`, `status`, `createdAt` | ✅ |

**Page Integration: 15/15 (100%)**

### 4.2 Auth Flow Verification (Static)

| Check Item | Implementation | File | Status |
|------------|---------------|------|--------|
| Login -> store token in localStorage + cookie | `authStore.login()` stores in both | `lib/store/authStore.ts:27-33` | ✅ |
| Role-based redirect after login | MERCHANT->/merchant/dashboard, ADMIN->/admin/users, CONSUMER->/ | `app/(auth)/login/page.tsx:29-31` | ✅ |
| AuthInitializer restores from localStorage on mount | `init()` reads from localStorage | `lib/store/authStore.ts:50-57` | ✅ |
| proxy.ts protects routes by cookie | Reads `token` and `role` cookies, redirects | `proxy.ts:14-15` | ✅ |
| Unauthenticated -> /login redirect | `if (isProtected && !token)` -> redirect | `proxy.ts:34-36` | ✅ |
| Already logged in -> role home redirect | PUBLIC_PATHS + token/role -> redirect | `proxy.ts:18-26` | ✅ |
| Role mismatch -> / redirect | MERCHANT/ADMIN path checks | `proxy.ts:39-44` | ✅ |
| Logout clears all storage | Removes localStorage + cookies | `lib/store/authStore.ts:36-44` | ✅ |

**Auth Flow: 8/8 (100%)**

---

## 5. Remaining Observations (Low Severity)

These are not plan checklist failures but notes for future improvement.

| # | Severity | Item | Detail | File |
|---|----------|------|--------|------|
| L-1 | Low | Consumer paths accessible to any role | `proxy.ts` does not restrict CONSUMER paths to CONSUMER role only. MERCHANT/ADMIN can access `/`, `/products/*`, `/mypage/*`. This may be intentional. | `proxy.ts:29-35` |
| L-2 | Low | Admin force-close sets `CLOSED` not `FORCE_CLOSED` | `handleForceClose` optimistically sets `status: 'CLOSED'` locally, though backend may return `FORCE_CLOSED`. The next full load would correct it. | `app/(admin)/admin/products/page.tsx:33` |
| L-3 | Low | New product description field marked required in UI | UI has `required` on description textarea, but `CreateProductRequest.description` is optional (`description?`). Minor UX discrepancy. | `app/(merchant)/merchant/products/new/page.tsx:107` |
| L-4 | Low | No error display on purchase failure | Purchase page closes dialog on error but does not show error message to user. | `app/(consumer)/products/[id]/purchase/page.tsx:39-40` |
| L-5 | Info | `PageResponse<T>` assumes backend always paginates | All list endpoints extract `.content` from paginated response. If backend ever returns unpaginated, this would fail. Currently consistent with backend behavior. | Multiple files |

---

## 6. Match Rate Summary

### 6.1 Plan Checklist Items

| Category | Items Checked | Matched | Rate |
|----------|:------------:|:-------:|:----:|
| API Endpoint URLs | 23 | 23 | 100% |
| HTTP Methods | 24 | 24 | 100% |
| Request Payload Shapes | 6 | 6 | 100% |
| ApiResponse<T> Unwrapping | 7 | 7 | 100% |
| Authorization Header | 5 | 5 | 100% |
| Token Cookie Consistency | 2 | 2 | 100% |
| **Total** | **67** | **67** | **100%** |

### 6.2 Previous Issue Resolution

| Category | Issues | Resolved | Rate |
|----------|:------:|:--------:|:----:|
| Critical (C-1~C-14) | 14 | 14 | 100% |
| High (H-1~H-8) | 8 | 8 | 100% |
| Backend (B-1~B-6) | 6 | 6 | 100% |
| **Total** | **28** | **28** | **100%** |

### 6.3 Page Integration

| Category | Pages | Verified | Rate |
|----------|:-----:|:--------:|:----:|
| Page-Level API Usage | 15 | 15 | 100% |
| Auth Flow Static Checks | 8 | 8 | 100% |
| **Total** | **23** | **23** | **100%** |

---

## 7. Overall Scores

| Category | Score | Status |
|----------|:-----:|:------:|
| API Endpoint Match | 100% | ✅ |
| HTTP Method Match | 100% | ✅ |
| Request/Response Type Match | 100% | ✅ |
| Auth Flow Consistency | 100% | ✅ |
| Page Integration | 100% | ✅ |
| **Overall Match Rate** | **100%** | ✅ |

---

## 8. Conclusion

Phase 7 Plan의 "1단계 -- 정적 코드 분석" 체크리스트 전 항목 통과.

이전 분석(v0.1)에서 발견된 13건의 Critical, 8건의 High 이슈가 모두 수정 완료되었으며, 6건의 Backend 이슈도 해결된 상태이다.

현재 프론트엔드 코드의 API 클라이언트 레이어(`lib/api/*.ts`), 타입 정의(`types/api.ts`), 인증 흐름(`authStore`, `proxy.ts`, `client.ts`), 그리고 15개 전체 페이지가 백엔드 스펙과 정확히 일치한다.

### 남은 작업

- **2단계 런타임 동작 확인**: 양쪽 서버를 실행하여 실제 네트워크 요청/응답 검증 필요
- **Low 이슈 5건**: 기능에는 영향 없으나 향후 개선 권장 (L-1~L-5)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-05 | Initial analysis -- 13 Critical, 8 High issues found | Claude |
| 0.2 | 2026-03-05 | Post-fix verification -- all issues resolved, 100% match | Claude (gap-detector) |
