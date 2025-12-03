import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(() => ({
  base: '/',
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      }
    }),
    tailwindcss()
  ],

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@/components": resolve(__dirname, "./src/components"),
      "@/lib": resolve(__dirname, "./src/lib"),
      "@/ui": resolve(__dirname, "./src/components/ui"),
      "@/hooks": resolve(__dirname, "./src/hooks"),
      "@/pages": resolve(__dirname, "./src/pages"),
    },
  },

  // 开发服务器配置
  server: {
    port: 5173,
    proxy: {
      // 代理所有 /api 请求到后端 NestJS 服务器
      '/api': {
        target: 'http://localhost:5521',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/nestapi'), // 将 /api 重写为 /nestapi
      },
    },
  },
}))
