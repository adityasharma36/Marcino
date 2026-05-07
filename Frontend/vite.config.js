/* global process */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const authServiceUrl = env.VITE_AUTH_SERVICE_URL || 'http://localhost:3000'
  const productServiceUrl = env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:3001'
  const cartServiceUrl = env.VITE_CART_SERVICE_URL || 'http://localhost:3002'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/auth': {
          target: authServiceUrl,
          changeOrigin: true,
        },
        '/api/products': {
          target: productServiceUrl,
          changeOrigin: true,
        },
        '/api/cart': {
          target: cartServiceUrl,
          changeOrigin: true,
        },
      },
    },
  }
})
