import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import prismjs from 'vite-plugin-prismjs';


// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  assetsInclude: ['**/*.md'],
  optimizeDeps: {
    include: ['@kangc/v-md-editor/lib/theme/vuepress.js'],
  },
  publicPath: process.env.NODE_ENV === 'production' ? './' : './',
  plugins: [
    vue(),
  ],
  server: {
    
    port: 80,
    open: true
  },
  build:{
    outDir:"docs"
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
