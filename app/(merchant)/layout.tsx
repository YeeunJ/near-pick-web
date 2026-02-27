import { MerchantSidebar } from '@/components/layout/MerchantSidebar'

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <MerchantSidebar />
      <main className="flex-1 p-6 bg-surface">{children}</main>
    </div>
  )
}
