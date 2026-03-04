// ─── 공통 ────────────────────────────────────────
export type UserRole = 'CONSUMER' | 'MERCHANT' | 'ADMIN'
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN'
export type ProductType = 'GENERAL' | 'FLASH_SALE'
export type ProductStatus = 'ACTIVE' | 'CLOSED' | 'FORCE_CLOSED'
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'
export type FlashPurchaseStatus = 'COMPLETED' | 'CANCELLED'

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
  shopAddress: string
  shopLat: number
  shopLng: number
  popularityScore: number
  remainingQuantity?: number
  distanceKm?: number
}

export interface ProductDetailResponse extends ProductSummaryResponse {
  description: string
  merchantId: number
  wishlistCount: number
  reservationCount: number
  purchaseCount: number
  endsAt?: string
}

// ─── Wishlist ─────────────────────────────────────
export interface WishlistItem {
  productId: number
  title: string
  price: number
  shopAddress: string
  productType: ProductType
  status: ProductStatus
}

// ─── Reservation ──────────────────────────────────
export interface ReservationItem {
  id: number
  productId: number
  productTitle: string
  quantity: number
  visitAt: string
  memo?: string
  status: ReservationStatus
}

export interface ReservationStatusResponse {
  reservationId: number
  status: ReservationStatus
}

// ─── FlashPurchase ────────────────────────────────
export interface FlashPurchaseItem {
  id: number
  productId: number
  productTitle: string
  quantity: number
  purchasedAt: string
  status: FlashPurchaseStatus
}

// ─── Merchant ─────────────────────────────────────
export interface MerchantDashboardResponse {
  shopName: string
  pendingReservationCount: number
  todayPurchaseCount: number
  totalPopularityScore: number
  recentReservations: ReservationItem[]
  myProducts: ProductSummaryResponse[]
}

export interface MerchantProfileResponse {
  userId: number
  shopName: string
  businessRegNo: string
  shopAddress: string
  shopLat: number
  shopLng: number
}

// ─── Admin ────────────────────────────────────────
export interface UserSummary {
  userId: number
  email: string
  role: UserRole
  status: UserStatus
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

export interface SignupRequest {
  email: string
  password: string
  role: UserRole
  shopName?: string
  businessRegNo?: string
}

export interface CreateReservationRequest {
  productId: number
  visitAt: string
  quantity: number
  memo?: string
}

export interface CreateFlashPurchaseRequest {
  productId: number
  quantity: number
}

export interface CreateProductRequest {
  title: string
  description: string
  price: number
  productType: ProductType
  quantity?: number
  endsAt?: string
}
