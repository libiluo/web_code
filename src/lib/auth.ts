export const ACCESS_TOKEN_KEY = 'access_token'
export const AUTH_EVENT = 'auth-change'

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

function emitChange() {
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function setAccessToken(accessToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  emitChange()
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  emitChange()
}
