import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages 部署时需要设置正确的 base 路径
  // 如果部署到 https://<USERNAME>.github.io/<REPO>/，则设置为 '/<REPO>/'
  // 如果部署到自定义域名或 https://<USERNAME>.github.io/，则设置为 '/'
  base: mode === 'production' ? '/web_code/' : '/',

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
}))
