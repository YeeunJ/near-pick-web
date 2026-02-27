import type { ProductSummaryResponse, ProductDetailResponse } from '@/types/api'

export const mockProducts: ProductSummaryResponse[] = [
  {
    id: 1,
    title: '아메리카노 (당일 할인)',
    price: 2500,
    productType: 'GENERAL',
    status: 'ACTIVE',
    shopAddress: '서울 강남구 역삼동 123',
    shopLat: 37.5000,
    shopLng: 127.0360,
    popularityScore: 127,
    distanceKm: 0.3,
  },
  {
    id: 2,
    title: '딸기 케이크 선착순',
    price: 5900,
    productType: 'FLASH_SALE',
    status: 'ACTIVE',
    shopAddress: '서울 강남구 삼성동 45',
    shopLat: 37.5080,
    shopLng: 127.0620,
    popularityScore: 89,
    remainingQuantity: 8,
    distanceKm: 0.7,
  },
  {
    id: 3,
    title: '수제 버거 세트',
    price: 12000,
    productType: 'GENERAL',
    status: 'ACTIVE',
    shopAddress: '서울 강남구 논현동 88',
    shopLat: 37.5120,
    shopLng: 127.0290,
    popularityScore: 64,
    distanceKm: 1.2,
  },
  {
    id: 4,
    title: '마카롱 6개 선착순',
    price: 8000,
    productType: 'FLASH_SALE',
    status: 'ACTIVE',
    shopAddress: '서울 강남구 청담동 12',
    shopLat: 37.5200,
    shopLng: 127.0480,
    popularityScore: 45,
    remainingQuantity: 3,
    distanceKm: 1.8,
  },
  {
    id: 5,
    title: '오늘의 런치 특선',
    price: 9500,
    productType: 'GENERAL',
    status: 'ACTIVE',
    shopAddress: '서울 강남구 역삼동 200',
    shopLat: 37.5010,
    shopLng: 127.0340,
    popularityScore: 38,
    distanceKm: 0.5,
  },
]

export const mockProductDetail: ProductDetailResponse = {
  ...mockProducts[0],
  description:
    '당일 원두로 내린 신선한 아메리카노입니다. 오후 2시까지 주문 시 10% 추가 할인이 적용됩니다. 직접 방문 수령만 가능합니다.',
  merchantId: 1,
  wishlistCount: 12,
  reservationCount: 5,
  purchaseCount: 3,
}

export const mockFlashProductDetail: ProductDetailResponse = {
  ...mockProducts[1],
  description:
    '제철 딸기를 사용한 수제 케이크입니다. 하루 한정 수량만 제조합니다. 선착순 마감 후 구매 불가.',
  merchantId: 2,
  wishlistCount: 24,
  reservationCount: 0,
  purchaseCount: 17,
  endsAt: '2026-02-28T18:00:00',
}
