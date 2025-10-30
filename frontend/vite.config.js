import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Allow Railway preview host & SPA fallback for sub-routes
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 8080,
    host: true,
    allowedHosts: [
      'localhost',
      /\.up\.railway\.app$/
    ],
    headers: { 'Cache-Control': 'no-store' }
  },
  server: { host: true }
})
