import type { ReservationItem, FlashPurchaseItem, WishlistItem } from '@/types/api'

export const mockReservations: ReservationItem[] = [
  {
    id: 1,
    productId: 1,
    productTitle: '아메리카노 (당일 할인)',
    quantity: 2,
    visitAt: '2026-03-01T14:00:00',
    memo: '테이크아웃으로 부탁드립니다',
    status: 'PENDING',
  },
  {
    id: 2,
    productId: 3,
    productTitle: '수제 버거 세트',
    quantity: 1,
    visitAt: '2026-03-02T12:30:00',
    status: 'CONFIRMED',
  },
  {
    id: 3,
    productId: 5,
    productTitle: '오늘의 런치 특선',
    quantity: 2,
    visitAt: '2026-02-20T13:00:00',
    status: 'CANCELLED',
  },
]

export const mockPurchases: FlashPurchaseItem[] = [
  {
    id: 1,
    productId: 2,
    productTitle: '딸기 케이크 선착순',
    quantity: 1,
    purchasedAt: '2026-02-25T10:15:00',
    status: 'COMPLETED',
  },
  {
    id: 2,
    productId: 4,
    productTitle: '마카롱 6개 선착순',
    quantity: 2,
    purchasedAt: '2026-02-22T15:30:00',
    status: 'COMPLETED',
  },
]

export const mockWishlists: WishlistItem[] = [
  {
    productId: 3,
    title: '수제 버거 세트',
    price: 12000,
    shopAddress: '서울 강남구 논현동 88',
    productType: 'GENERAL',
    status: 'ACTIVE',
  },
  {
    productId: 5,
    title: '오늘의 런치 특선',
    price: 9500,
    shopAddress: '서울 강남구 역삼동 200',
    productType: 'GENERAL',
    status: 'ACTIVE',
  },
]
