import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // path 모듈 불러오기

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // "@"를 "src" 폴더로 인식하도록 설정
      '@': path.resolve(__dirname, './src'),
    },
  },
})