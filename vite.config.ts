import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    // Dành cho khi bạn chạy `npm run dev`
    // không ảnh hưởng đến build production, nhưng vẫn nên có
    open: true,
  },
})
