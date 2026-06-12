import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { login, register } from '@/api/modules/user'
import { setAccessToken } from '@/lib/auth'

type Mode = 'login' | 'register'

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isRegister = mode === 'register'

  const reset = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setMode('login')
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('请输入邮箱和密码')
      return
    }
    if (isRegister && password !== confirmPassword) {
      toast.error('两次输入的密码不一致')
      return
    }

    setSubmitting(true)
    try {
      const res = isRegister
        ? await register({ email, password })
        : await login({ email, password })
      setAccessToken(res.access_token)
      toast.success(isRegister ? '注册成功' : '登录成功')
      handleOpenChange(false)
    } catch {
      // request 拦截器已经 toast 过错误信息
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isRegister ? '注册账号' : '登录'}</DialogTitle>
          <DialogDescription>
            {isRegister ? '创建一个新账号以继续' : '使用邮箱和密码登录'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="login-email">邮箱</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="login-password">密码</Label>
            <Input
              id="login-password"
              type="password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
            />
          </div>

          {isRegister && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="login-password-confirm">确认密码</Label>
              <Input
                id="login-password-confirm"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="再次输入密码"
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setMode(isRegister ? 'login' : 'register')}
              className="text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              {isRegister ? '已有账号？去登录' : '注册'}
            </button>
          </div>

          <Button type="submit" disabled={submitting} className="mt-1">
            {submitting ? '提交中…' : isRegister ? '注册' : '登录'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
