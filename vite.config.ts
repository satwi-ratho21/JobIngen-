import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Accept requests from any host header (allow external preview domains)
    port: 3000,
    strictPort: true,
    open: true,
    // Allow Render preview domains (and other onrender subdomains)
    allowedHosts: ['.onrender.com', 'localhost']
  },
  preview: {
    // Vite preview server used for production-like serving of the built `dist`
    host: true,
    port: Number(process.env.PORT) || 5173,
    strictPort: true,
    allowedHosts: ['.onrender.com', 'localhost']
  }
})

