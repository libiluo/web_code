import { useEffect, useState } from 'react'
import { AUTH_EVENT, clearAuth, getAccessToken } from '@/lib/auth'

export { setAccessToken, clearAuth } from '@/lib/auth'

export function useAuth() {
  const [token, setToken] = useState<string | null>(getAccessToken)

  useEffect(() => {
    const sync = () => setToken(getAccessToken())
    window.addEventListener(AUTH_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(AUTH_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return { isLoggedIn: !!token, logout: clearAuth }
}
