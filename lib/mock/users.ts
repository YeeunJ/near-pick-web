import type { UserSummary, MerchantDashboardResponse, ProductListItem } from '@/types/api'

export const mockUsers: UserSummary[] = [
  {
    userId: 1,
    email: 'consumer1@example.com',
    role: 'CONSUMER',
    status: 'ACTIVE',
    createdAt: '2026-01-10T09:00:00',
  },
  {
    userId: 2,
    email: 'merchant1@example.com',
    role: 'MERCHANT',
    status: 'ACTIVE',
    createdAt: '2026-01-12T10:30:00',
  },
  {
    userId: 3,
    email: 'suspended@example.com',
    role: 'CONSUMER',
    status: 'SUSPENDED',
    createdAt: '2026-01-15T14:00:00',
  },
  {
    userId: 4,
    email: 'merchant2@example.com',
    role: 'MERCHANT',
    status: 'ACTIVE',
    createdAt: '2026-01-20T11:00:00',
  },
]

const mockProductListItems: ProductListItem[] = [
  {
    id: 1,
    title: '아메리카노 (당일 할인)',
    price: 2500,
    status: 'ACTIVE',
    productType: 'GENERAL',
    stock: 10,
    wishlistCount: 12,
  },
  {
    id: 2,
    title: '딸기 케이크 선착순',
    price: 5900,
    status: 'ACTIVE',
    productType: 'FLASH_SALE',
    stock: 8,
    wishlistCount: 24,
  },
  {
    id: 3,
    title: '수제 버거 세트',
    price: 12000,
    status: 'ACTIVE',
    productType: 'GENERAL',
    stock: 5,
    wishlistCount: 8,
  },
]

export const mockDashboard: MerchantDashboardResponse = {
  merchantId: 2,
  businessName: '역삼 커피랩',
  thisMonthReservationCount: 3,
  thisMonthPurchaseCount: 5,
  totalPopularityScore: 127,
  products: mockProductListItems,
  recentReservations: [
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
  ],
}
