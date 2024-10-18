import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import md from 'vite-plugin-md'

// https://vitejs.dev/config/
export default defineConfig({
  base:"/headwriteblog/",
  plugins: [
    vue(),
    md()
  ],
  assetsInclude: ['**/*.md'],
  build:{
    outDir:"docs"
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
