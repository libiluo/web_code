/**
 * Axios 请求封装
 * 包含请求拦截器、响应拦截器和统一的错误处理
 */

import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios'

// ==================== 类型定义 ====================

/**
 * 统一的 API 响应格式
 */
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

/**
 * Token 管理器接口
 */
export interface TokenManager {
  getToken: () => string | null
  setToken: (token: string) => void
  removeToken: () => void
}

/**
 * 错误处理器
 */
export interface ErrorHandler {
  onUnauthorized?: () => void
  onForbidden?: () => void
  onNotFound?: () => void
  onServerError?: () => void
  onNetworkError?: () => void
  onBusinessError?: (message: string, code: number) => void
}

/**
 * 请求配置选项
 */
export interface RequestOptions {
  /** API 基础 URL */
  baseURL?: string
  /** 请求超时时间（毫秒） */
  timeout?: number
  /** Token 管理器 */
  tokenManager?: TokenManager
  /** 错误处理器 */
  errorHandler?: ErrorHandler
  /** 是否返回原始响应（不解包 data） */
  rawResponse?: boolean
  /** 成功的业务状态码列表 */
  successCodes?: number[]
}

/**
 * 扩展的请求配置
 */
export interface ExtendedRequestConfig extends AxiosRequestConfig {
  /** 是否跳过响应拦截器（返回原始响应） */
  skipResponseInterceptor?: boolean
  /** 自定义错误处理 */
  customErrorHandler?: ErrorHandler
}

// ==================== 默认配置 ====================

/**
 * 默认的 Token 管理器（使用 localStorage）
 */
const defaultTokenManager: TokenManager = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token: string) => localStorage.setItem('token', token),
  removeToken: () => localStorage.removeItem('token'),
}

/**
 * 默认的错误处理器
 */
const defaultErrorHandler: ErrorHandler = {
  onUnauthorized: () => {
    console.error('未授权，请重新登录')
    defaultTokenManager.removeToken()
    // window.location.href = '/login' // 根据需要取消注释
  },
  onForbidden: () => {
    console.error('没有权限访问')
  },
  onNotFound: () => {
    console.error('请求的资源不存在')
  },
  onServerError: () => {
    console.error('服务器错误')
  },
  onNetworkError: () => {
    console.error('网络错误，请检查您的网络连接')
  },
  onBusinessError: (message: string) => {
    console.error('业务错误:', message)
  },
}

/**
 * 默认成功状态码
 */
const DEFAULT_SUCCESS_CODES = [200, 0]

// ==================== 创建请求实例 ====================

/**
 * 全局配置
 */
let globalConfig: Required<RequestOptions> = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  tokenManager: defaultTokenManager,
  errorHandler: defaultErrorHandler,
  rawResponse: false,
  successCodes: DEFAULT_SUCCESS_CODES,
}

/**
 * 配置请求选项
 */
export function configureRequest(options: RequestOptions): void {
  globalConfig = {
    ...globalConfig,
    ...options,
    errorHandler: {
      ...globalConfig.errorHandler,
      ...options.errorHandler,
    },
    successCodes: options.successCodes || globalConfig.successCodes,
  }

  // 更新 axios 实例配置
  if (options.baseURL) {
    request.defaults.baseURL = options.baseURL
  }
  if (options.timeout) {
    request.defaults.timeout = options.timeout
  }
}

/**
 * 创建 axios 实例
 */
const request: AxiosInstance = axios.create({
  baseURL: globalConfig.baseURL,
  timeout: globalConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ==================== 请求拦截器 ====================

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加 token
    const token = globalConfig.tokenManager.getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// ==================== 响应拦截器 ====================

request.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as ExtendedRequestConfig

    // 开发环境打印响应信息
    if (import.meta.env.DEV) {
      console.log('📥 响应:', response.config.url, response.data)
    }

    // 如果配置了跳过拦截器或者全局配置为返回原始响应，直接返回
    if (config.skipResponseInterceptor || globalConfig.rawResponse) {
      return response.data
    }

    // 统一返回完整响应，由调用者判断 code 并处理
    return response.data as ApiResponse<unknown>
  },
  (error: AxiosError) => {
    const config = error.config as ExtendedRequestConfig | undefined
    const errorHandler = config?.customErrorHandler || globalConfig.errorHandler

    // HTTP 错误处理 - 统一返回格式，不 reject
    if (error.response) {
      const { status, data } = error.response

      // 触发错误处理回调（用于日志、提示等）
      switch (status) {
        case 401:
          errorHandler.onUnauthorized?.()
          break
        case 403:
          errorHandler.onForbidden?.()
          break
        case 404:
          errorHandler.onNotFound?.()
          break
        case 500:
        case 502:
        case 503:
        case 504:
          errorHandler.onServerError?.()
          break
      }

      // 返回统一的错误格式，不 reject
      return {
        code: status,
        data: null,
        message: (data as { message?: string })?.message || error.message || `请求失败: ${status}`
      } as ApiResponse<null>
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      errorHandler.onNetworkError?.()
      return {
        code: 0,
        data: null,
        message: '网络错误，请检查您的网络连接'
      } as ApiResponse<null>
    } else {
      // 其他错误
      console.error('请求配置错误:', error.message)
      return {
        code: -1,
        data: null,
        message: error.message || '请求配置错误'
      } as ApiResponse<null>
    }
  }
)

// ==================== 请求方法封装 ====================

/**
 * GET 请求
 */
export function get<T = unknown>(
  url: string,
  config?: ExtendedRequestConfig
): Promise<T> {
  return request.get(url, config)
}

/**
 * POST 请求
 */
export function post<T = unknown>(
  url: string,
  data?: unknown,
  config?: ExtendedRequestConfig
): Promise<T> {
  return request.post(url, data, config)
}

/**
 * PUT 请求
 */
export function put<T = unknown>(
  url: string,
  data?: unknown,
  config?: ExtendedRequestConfig
): Promise<T> {
  return request.put(url, data, config)
}

/**
 * DELETE 请求
 */
export function del<T = unknown>(
  url: string,
  config?: ExtendedRequestConfig
): Promise<T> {
  return request.delete(url, config)
}

/**
 * PATCH 请求
 */
export function patch<T = unknown>(
  url: string,
  data?: unknown,
  config?: ExtendedRequestConfig
): Promise<T> {
  return request.patch(url, data, config)
}

/**
 * 上传文件
 */
export function upload<T = unknown>(
  url: string,
  formData: FormData,
  config?: ExtendedRequestConfig
): Promise<T> {
  return request.post(url, formData, {
    ...config,
    headers: {
      ...config?.headers,
      'Content-Type': 'multipart/form-data',
    },
  })
}

// ==================== 请求取消 ====================

/**
 * 创建可取消的请求
 */
export function createCancelableRequest<T = unknown>(
  requestFn: (signal: AbortSignal) => Promise<T>
): {
  request: Promise<T>
  cancel: (reason?: string) => void
} {
  const controller = new AbortController()

  return {
    request: requestFn(controller.signal),
    cancel: (reason?: string) => controller.abort(reason),
  }
}

/**
 * 带取消功能的 GET 请求
 */
export function getCancelable<T = unknown>(
  url: string,
  config?: ExtendedRequestConfig
) {
  return createCancelableRequest<T>(
    (signal) => request.get(url, { ...config, signal })
  )
}

/**
 * 带取消功能的 POST 请求
 */
export function postCancelable<T = unknown>(
  url: string,
  data?: unknown,
  config?: ExtendedRequestConfig
) {
  return createCancelableRequest<T>(
    (signal) => request.post(url, data, { ...config, signal })
  )
}

// ==================== 工具方法 ====================

/**
 * 获取当前 token 管理器
 */
export function getTokenManager(): TokenManager {
  return globalConfig.tokenManager
}

/**
 * 设置 token
 */
export function setToken(token: string): void {
  globalConfig.tokenManager.setToken(token)
}

/**
 * 获取 token
 */
export function getToken(): string | null {
  return globalConfig.tokenManager.getToken()
}

/**
 * 移除 token
 */
export function removeToken(): void {
  globalConfig.tokenManager.removeToken()
}

/**
 * 检查是否为取消请求错误
 */
export function isCancel(error: unknown): boolean {
  return axios.isCancel(error)
}

// 导出 axios 实例（用于特殊情况）
export default request
