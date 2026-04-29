import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import router from './router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, //永不自动失效
      gcTime: 1000 * 60 * 30, //垃圾回收时间，没有任何组件使用这个 query，缓存还能保留：30分钟
      refetchOnWindowFocus: false, //浏览器窗口重新聚焦时，不自动重新请求。
      refetchOnReconnect: false,//断网 → 恢复网络，不自动重新请求。
      retry: 1,//请求失败，最多再重试 1 次
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  )
}

export default App
