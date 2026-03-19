import type { ProductSpecItem } from '@/types/api'

interface SpecsSectionProps {
  specs: ProductSpecItem[]
}

export function SpecsSection({ specs }: SpecsSectionProps) {
  if (specs.length === 0) return null

  return (
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
  )
}
