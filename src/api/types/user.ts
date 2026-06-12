export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface UserInfo {
  id: number
  email: string
  nickname?: string
  avatar?: string
}

// refresh_token 通过 http-only cookie 由后端下发，前端不可见。
// 登录/注册/刷新接口的响应体只包含 access_token。
export interface AccessTokenResponse {
  access_token: string
}

export type LoginResponse = AccessTokenResponse

export type RefreshResponse = AccessTokenResponse
