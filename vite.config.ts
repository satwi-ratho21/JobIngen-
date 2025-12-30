import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow access from network
    port: 3000,
    strictPort: true,
    open: true,
    // Allow Render preview domains (and other onrender subdomains)
    // Add specific hostnames or a wildcard-like entry for the onrender domain
    allowedHosts: ['.onrender.com', 'localhost']
  }
})

