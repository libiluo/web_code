import { useCallback, useEffect, useRef, useState } from 'react'

interface UseRequestOptions<T> {
  manual?: boolean
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (err: unknown) => void
}

interface UseRequestResult<T, P extends unknown[]> {
  data: T | undefined
  loading: boolean
  error: unknown
  run: (...args: P) => Promise<T | undefined>
  refresh: () => Promise<T | undefined>
}

export function useRequest<T, P extends unknown[] = []>(
  service: (...args: P) => Promise<T>,
  options: UseRequestOptions<T> = {},
): UseRequestResult<T, P> {
  const { manual = false, initialData, onSuccess, onError } = options

  const [data, setData] = useState<T | undefined>(initialData)
  const [loading, setLoading] = useState(!manual)
  const [error, setError] = useState<unknown>(null)

  const serviceRef = useRef(service)
  serviceRef.current = service
  const lastArgsRef = useRef<P | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const run = useCallback(async (...args: P): Promise<T | undefined> => {
    lastArgsRef.current = args
    setLoading(true)
    setError(null)
    try {
      const res = await serviceRef.current(...args)
      if (!mountedRef.current) return res
      setData(res)
      onSuccess?.(res)
      return res
    } catch (err) {
      if (!mountedRef.current) return
      setError(err)
      onError?.(err)
      return undefined
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [onSuccess, onError])

  const refresh = useCallback(() => {
    return run(...((lastArgsRef.current ?? []) as P))
  }, [run])

  useEffect(() => {
    if (!manual) run(...([] as unknown as P))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { data, loading, error, run, refresh }
}
