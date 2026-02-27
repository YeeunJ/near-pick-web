import type { UserSummary, MerchantDashboardResponse } from '@/types/api'
import { mockReservations } from './reservations'
import { mockProducts } from './products'

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

export const mockDashboard: MerchantDashboardResponse = {
  shopName: '역삼 커피랩',
  pendingReservationCount: 3,
  todayPurchaseCount: 5,
  totalPopularityScore: 127,
  recentReservations: mockReservations.filter((r) => r.status === 'PENDING'),
  myProducts: mockProducts.slice(0, 3),
}
