import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // port: 5173, // Vue开发端口
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Node.js服务器地址
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
