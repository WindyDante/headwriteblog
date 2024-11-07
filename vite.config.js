import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import prismjs from 'vite-plugin-prismjs';


// https://vitejs.dev/config/
export default defineConfig({
  base: "/headwriteblog/",
  assetsInclude: ['**/*.md'],
  optimizeDeps: {
    include: ['@kangc/v-md-editor/lib/theme/vuepress.js'],
  },
  plugins: [
    vue(),
    
  ],
  build:{
    outDir:"docs"
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
