import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { toast } from 'sonner'

interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

const TOKEN_KEY = 'token'
const SUCCESS_CODE = 200

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 300000,
  headers: { 'Content-Type': 'application/json' },
})

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message, data } = response.data
    if (code !== SUCCESS_CODE) {
      switch (code) {
        case 401:
          localStorage.removeItem(TOKEN_KEY)
          window.location.href = '/login'
          break
        default:
          toast.error(message || 'Request failed')
      }
      return Promise.reject(new Error(message || 'Request failed'))
    }
    return data as unknown as AxiosResponse
  },
  (error) => {
    const status = error.response?.status
    const msg =
      status === 401
        ? 'Unauthorized'
        : status === 403
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
