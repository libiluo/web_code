/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  // 可以在这里添加其他环境变量
  // readonly VITE_APP_TITLE: string
  // readonly VITE_OTHER_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}