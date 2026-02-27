import { Badge } from '@/components/ui/badge'
import type { ProductStatus, ReservationStatus, UserStatus, FlashPurchaseStatus } from '@/types/api'

type Status = ProductStatus | ReservationStatus | UserStatus | FlashPurchaseStatus

const STATUS_MAP: Record<Status, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  // ProductStatus
  ACTIVE:       { label: '판매중',   variant: 'default' },
  CLOSED:       { label: '종료',     variant: 'secondary' },
  FORCE_CLOSED: { label: '강제종료', variant: 'destructive' },
  // ReservationStatus
  PENDING:      { label: '대기중',   variant: 'outline' },
  CONFIRMED:    { label: '확정',     variant: 'default' },
  CANCELLED:    { label: '취소',     variant: 'secondary' },
  // UserStatus
  SUSPENDED:    { label: '정지',     variant: 'destructive' },
  WITHDRAWN:    { label: '탈퇴',     variant: 'secondary' },
  // FlashPurchaseStatus
  COMPLETED:    { label: '완료',     variant: 'secondary' },
}

interface StatusBadgeProps {
  status: Status
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_MAP[status]
  if (!config) return null
  return <Badge variant={config.variant}>{config.label}</Badge>
}
