import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { StatusBadge } from '@/components/features/StatusBadge'
import { mockUsers } from '@/lib/mock/users'
import { formatDate } from '@/lib/utils'
import type { UserRole } from '@/types/api'

const TABS: { value: UserRole | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'CONSUMER', label: '소비자' },
  { value: 'MERCHANT', label: '소상공인' },
]

export default function AdminUsersPage() {
  return (
    <div className="space-y-4 max-w-4xl">
      <h1 className="text-xl font-bold">사용자 관리</h1>

      {/* 검색 */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="이메일로 검색" />
      </div>

      <Tabs defaultValue="ALL">
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => {
          const items =
            tab.value === 'ALL'
              ? mockUsers
              : mockUsers.filter((u) => u.role === tab.value)
          return (
            <TabsContent key={tab.value} value={tab.value} className="mt-4">
              <div className="border border-border rounded-lg overflow-hidden bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>이메일</TableHead>
                      <TableHead>역할</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>가입일</TableHead>
                      <TableHead className="text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((user) => (
                      <TableRow key={user.userId}>
                        <TableCell className="text-sm">{user.email}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.role === 'CONSUMER' ? '소비자' : '소상공인'}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={user.status} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1.5 justify-end">
                            {user.status === 'ACTIVE' && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">정지</Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>사용자 정지</DialogTitle>
                                    <DialogDescription>
                                      {user.email} 계정을 정지하시겠습니까?
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter className="gap-2">
                                    <Button variant="outline" className="flex-1">취소</Button>
                                    <Button variant="destructive" className="flex-1">정지</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="destructive" size="sm">탈퇴</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>회원 탈퇴 처리</DialogTitle>
                                  <DialogDescription>
                                    {user.email} 계정을 탈퇴 처리하시겠습니까?
                                    이 작업은 되돌릴 수 없습니다.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="gap-2">
                                  <Button variant="outline" className="flex-1">취소</Button>
                                  <Button variant="destructive" className="flex-1">탈퇴</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
