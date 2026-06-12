import request from '../request'
import type {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  RegisterRequest,
  UserInfo,
} from '../types'

export const login = (data: LoginRequest) => {
  return request.post<LoginResponse>('/auth/login', data, {
    skipAuthRefresh: true,
  })
}

export const register = (data: RegisterRequest) => {
  return request.post<LoginResponse>('/auth/register', data, {
    skipAuthRefresh: true,
  })
}

// refresh_token 走 http-only cookie，无需请求体，浏览器自动携带。
export const refreshTokens = () => {
  return request.post<RefreshResponse>('/auth/refresh', undefined, {
    skipAuthRefresh: true,
  })
}

export const logout = () => {
  return request.post('/auth/logout', undefined, { skipAuthRefresh: true })
}

export const getCurrentUser = () => {
  return request.get<UserInfo>('/auth/user')
}
