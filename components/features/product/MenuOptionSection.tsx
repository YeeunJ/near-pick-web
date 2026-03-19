import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import type { ProductMenuOptionGroupResponse } from '@/types/api'

interface MenuOptionSectionProps {
  menuOptions: ProductMenuOptionGroupResponse[]
}

export function MenuOptionSection({ menuOptions }: MenuOptionSectionProps) {
  if (menuOptions.length === 0) return null

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-sm">메뉴 옵션</h2>
      {menuOptions.map((group) => (
        <div key={group.id} className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{group.name}</span>
            <Badge
              variant={group.required ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {group.required ? '필수' : '선택'}
            </Badge>
            {group.maxSelect > 1 && (
              <span className="text-xs text-muted-foreground">최대 {group.maxSelect}개</span>
            )}
          </div>
          <ul className="space-y-1 pl-2">
            {group.choices.map((choice) => (
              <li
                key={choice.id}
                className="flex justify-between text-sm text-muted-foreground"
              >
                <span>{choice.name}</span>
                {choice.additionalPrice > 0 && (
                  <span>+{formatPrice(choice.additionalPrice)}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
