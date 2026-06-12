import { useState } from 'react'
import { LogIn, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoginDialog } from '@/components/LoginDialog'
import { useAuth } from '@/hooks/useAuth'
import { logout as logoutApi } from '@/api/modules/user'
import { clearAuth } from '@/lib/auth'

export default function Mine() {
  const { isLoggedIn } = useAuth()
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logoutApi()
    } catch {
      // 后端登出失败也清本地，避免用户卡死在已登录态
    } finally {
      clearAuth()
      setLoggingOut(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground">登录后查看你的信息</p>
        <Button onClick={() => setOpen(true)}>
          <LogIn />
          点击登录
        </Button>
        <LoginDialog open={open} onOpenChange={setOpen} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">我的</h1>
      <div className="rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground">
        已登录
      </div>
      <Button
        variant="outline"
        onClick={handleLogout}
        disabled={loggingOut}
        className="self-start"
      >
        <LogOut />
        {loggingOut ? '退出中…' : '退出登录'}
      </Button>
    </div>
  )
}
