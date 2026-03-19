import type { ProductCategory } from '@/types/api'

const CATEGORY_CONFIG: Record<
  ProductCategory,
  { label: string; className: string }
> = {
  FOOD: { label: '음식', className: 'bg-orange-100 text-orange-700' },
  BEVERAGE: { label: '음료', className: 'bg-blue-100 text-blue-700' },
  BEAUTY: { label: '뷰티', className: 'bg-pink-100 text-pink-700' },
  DAILY: { label: '생활', className: 'bg-green-100 text-green-700' },
  OTHER: { label: '기타', className: 'bg-gray-100 text-gray-600' },
}

interface CategoryBadgeProps {
  category: ProductCategory
  size?: 'sm' | 'md'
}

export function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  const { label, className } = CATEGORY_CONFIG[category]
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${className} ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
    >
      {label}
    </span>
  )
}
