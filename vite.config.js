import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import postcssPxtorem from 'postcss-pxtorem' // 引入转换插件

// https://vite.dev/config/
export default defineConfig({
  base: './',
  build: {
    assetsInlineLimit: 1024 * 1024 * 1,
    outDir: 'dist',
  },
  plugins: [vue(), vueJsx(), vueDevTools(), tailwindcss()],
  css: {
    postcss: {
      plugins: [
        postcssPxtorem({
          // 使用 PostCSS 插件进行 px 转换
          rootValue: 16, // 根据设计稿调整，例如：375设计稿用37.5，750设计稿用75
          propList: ['*'],
        }),
      ],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
