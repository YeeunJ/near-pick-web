// ─── 공통 ────────────────────────────────────────
export type UserRole = 'CONSUMER' | 'MERCHANT' | 'ADMIN'
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN'
export type ProductType = 'RESERVATION' | 'FLASH_SALE'
export type ProductStatus = 'ACTIVE' | 'CLOSED' | 'FORCE_CLOSED'
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'
export type FlashPurchaseStatus = 'COMPLETED' | 'CANCELLED'
export type SortType = 'POPULARITY' | 'DISTANCE'

// ─── Auth ────────────────────────────────────────
export interface LoginResult {
  accessToken: string
  userId: number
  role: UserRole
}

export interface SignupResponse {
  userId: number
  email: string
  role: UserRole
}

// ─── Product ─────────────────────────────────────
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
}

export interface ProductListItem {
  id: number
  title: string
  price: number
  status: ProductStatus
  productType: ProductType
  stock: number
  wishlistCount: number
}

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
}

// ─── Wishlist ─────────────────────────────────────
export interface WishlistItem {
  wishlistId: number
  productId: number
  productTitle: string
  productPrice: number
  productType: ProductType
  productStatus: ProductStatus
  shopAddress: string | null
  createdAt: string
}

// ─── Reservation ──────────────────────────────────
export interface ReservationItem {
  reservationId: number
  productId: number
  productTitle: string
  quantity: number
  status: ReservationStatus
  memo: string | null
  visitScheduledAt: string | null
  reservedAt: string
}

export interface ReservationStatusResponse {
  reservationId: number
  status: ReservationStatus
}

// ─── FlashPurchase ────────────────────────────────
export interface FlashPurchaseItem {
  purchaseId: number
  productId: number
  productTitle: string
  quantity: number
  status: FlashPurchaseStatus
  purchasedAt: string
}

// ─── Merchant ─────────────────────────────────────
export interface MerchantDashboardResponse {
  merchantId: number
  businessName: string
  totalPopularityScore: number
  thisMonthReservationCount: number
  thisMonthPurchaseCount: number
  products: ProductListItem[]
  recentReservations: ReservationItem[]
}

export interface MerchantProfileResponse {
  merchantId: number
  email: string
  businessName: string
  businessRegNo: string
  shopLat: number
  shopLng: number
  shopAddress: string | null
  rating: number
  isVerified: boolean
}

// ─── Admin ────────────────────────────────────────
export interface UserSummary {
  userId: number
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
}

export interface AdminProductItem {
  productId: number
  title: string
  price: number
  merchantId: number
  merchantName: string
  status: ProductStatus
  createdAt: string
}

// ─── Pagination ───────────────────────────────────
export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

// ─── ApiResponse wrapper ──────────────────────────────
export interface ApiResponse<T> {
  success: boolean
  data: T
  error: string | null
}

// ─── Request Types ────────────────────────────────────
export interface LoginRequest {
  email: string
  password: string
}

export interface SignupConsumerRequest {
  email: string
  password: string
}

export interface SignupMerchantRequest {
  email: string
  password: string
  businessName: string
  businessRegNo: string
  shopAddress: string
  shopLat: number
  shopLng: number
}

export interface CreateReservationRequest {
  productId: number
  visitScheduledAt?: string
  quantity: number
  memo?: string
}

export interface CreateFlashPurchaseRequest {
  productId: number
  quantity: number
}

export interface CreateProductRequest {
  title: string
  description?: string
  price: number
  productType: ProductType
  stock?: number
  availableFrom?: string
  availableUntil?: string
}
