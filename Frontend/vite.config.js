import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        // Change this port if your backend runs elsewhere.
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
