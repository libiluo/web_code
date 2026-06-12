import axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import NProgress from 'nprogress'
import { toast } from 'sonner'
import { clearAuth, getAccessToken, setAccessToken } from '@/lib/auth'

declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuthRefresh?: boolean
    _retry?: boolean
  }
}

NProgress.configure({ showSpinner: false, trickleSpeed: 200, minimum: 0.1 })

let pendingCount = 0
function startProgress() {
  if (pendingCount === 0) NProgress.start()
  pendingCount++
}
function stopProgress() {
  pendingCount = Math.max(0, pendingCount - 1)
  if (pendingCount === 0) NProgress.done()
}

interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

interface AccessTokenPayload {
  access_token: string
}

const SUCCESS_CODE = 200
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 300000,
  headers: { 'Content-Type': 'application/json' },
  // 携带 http-only refresh cookie（登录下发、刷新读取、登出清除）
  withCredentials: true,
})

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    startProgress()
    const token = getAccessToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    stopProgress()
    return Promise.reject(error)
  },
)

// 模块级互斥：多个 401 请求只触发一次 refresh，全部等同一个 promise
let refreshPromise: Promise<string> | null = null

async function performRefresh(): Promise<string> {
  // refresh_token 是 http-only cookie，由浏览器随请求自动携带，前端不可读取。
  // 用裸 axios，不走拦截器，避免再次触发刷新或被业务 code 拦截逻辑改写返回值
  const res = await axios.post<ApiResponse<AccessTokenPayload>>(
    `${BASE_URL}/auth/refresh`,
    undefined,
    {
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    },
  )
  const body = res.data
  if (body.code !== SUCCESS_CODE) {
    throw new Error(body.message || 'Refresh failed')
  }
  const { access_token } = body.data
  setAccessToken(access_token)
  return access_token
}

function handleAuthFailure() {
  clearAuth()
  toast.error('登录已过期，请重新登录')
}

instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    stopProgress()
    const { code, message, data } = response.data
    if (code !== SUCCESS_CODE) {
      toast.error(message || 'Request failed')
      return Promise.reject(new Error(message || 'Request failed'))
    }
    return data as unknown as AxiosResponse
  },
  async (error: AxiosError) => {
    stopProgress()
    const status = error.response?.status
    const original = error.config as InternalAxiosRequestConfig | undefined

    // access token 过期 → 尝试刷新一次
    if (
      status === 401 &&
      original &&
      !original._retry &&
      !original.skipAuthRefresh
    ) {
      original._retry = true
      try {
        if (!refreshPromise) {
          refreshPromise = performRefresh().finally(() => {
            refreshPromise = null
          })
        }
        const newToken = await refreshPromise
        const headers = AxiosHeaders.from(original.headers)
        headers.set('Authorization', `Bearer ${newToken}`)
        original.headers = headers
        return instance(original)
      } catch (refreshErr) {
        handleAuthFailure()
        return Promise.reject(refreshErr)
      }
    }

    // 刷新接口本身 401 / 已重试仍 401 → 直接登出
    if (status === 401) {
      handleAuthFailure()
      return Promise.reject(error)
    }

    const msg =
      status === 403
        ? 'Forbidden'
        : status === 404
          ? 'Not found'
          : status && status >= 500
            ? 'Server error'
            : error.message || 'Network error'
    toast.error(msg)
    return Promise.reject(new Error(msg))
  },
)

export const request = {
  get<T = unknown>(url: string, params?: object, config?: AxiosRequestConfig) {
    return instance.get<unknown, T>(url, { params, ...config })
  },
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return instance.post<unknown, T>(url, data, config)
  },
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return instance.put<unknown, T>(url, data, config)
  },
  delete<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return instance.delete<unknown, T>(url, config)
  },
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return instance.patch<unknown, T>(url, data, config)
  },
}

export default request
