import type { ReservationItem, FlashPurchaseItem, WishlistItem } from '@/types/api'

export const mockReservations: ReservationItem[] = [
  {
    reservationId: 1,
    productId: 1,
    productTitle: '아메리카노 (당일 할인)',
    quantity: 2,
    visitScheduledAt: '2026-03-01T14:00:00',
    reservedAt: '2026-02-28T10:00:00',
    status: 'PENDING',
    memo: '아이스로 부탁드려요',
  },
  {
    reservationId: 2,
    productId: 3,
    productTitle: '수제 버거 세트',
    quantity: 1,
    visitScheduledAt: '2026-03-02T12:30:00',
    reservedAt: '2026-02-28T11:00:00',
    status: 'CONFIRMED',
    memo: null,
  },
  {
    reservationId: 3,
    productId: 5,
    productTitle: '오늘의 런치 특선',
    quantity: 2,
    visitScheduledAt: '2026-02-20T13:00:00',
    reservedAt: '2026-02-19T09:00:00',
    status: 'CANCELLED',
    memo: null,
  },
]

export const mockPurchases: FlashPurchaseItem[] = [
  {
    purchaseId: 1,
    productId: 2,
    productTitle: '딸기 케이크 선착순',
    quantity: 1,
    purchasedAt: '2026-02-25T10:15:00',
    status: 'COMPLETED',
  },
  {
    purchaseId: 2,
    productId: 4,
    productTitle: '마카롱 6개 선착순',
    quantity: 2,
    purchasedAt: '2026-02-22T15:30:00',
    status: 'COMPLETED',
  },
]

export const mockWishlists: WishlistItem[] = [
  {
    wishlistId: 1,
    productId: 3,
    productTitle: '수제 버거 세트',
    productPrice: 12000,
    productType: 'RESERVATION',
    productStatus: 'ACTIVE',
    shopAddress: '서울 강남구 논현동 78',
    createdAt: '2026-02-20T10:00:00',
  },
  {
    wishlistId: 2,
    productId: 5,
    productTitle: '오늘의 런치 특선',
    productPrice: 9500,
    productType: 'RESERVATION',
    productStatus: 'ACTIVE',
    shopAddress: '서울 강남구 역삼동 56',
    createdAt: '2026-02-21T11:00:00',
  },
]
