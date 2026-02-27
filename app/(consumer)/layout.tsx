import { BottomNav } from '@/components/layout/BottomNav'

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col max-w-[430px] mx-auto bg-surface">
      <main className="flex-1 pb-16">{children}</main>
      <BottomNav />
    </div>
  )
}
