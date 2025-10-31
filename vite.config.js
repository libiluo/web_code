import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  console.log('Vite config - mode:', mode, 'command:', command)
  return {
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
}
})
