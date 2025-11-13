import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),],
  server: {
    port: 3000,
    proxy: {
      '/viacep': {
        target: 'https://viacep.com.br',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/viacep/, ''),
      },
    },
  }
})
