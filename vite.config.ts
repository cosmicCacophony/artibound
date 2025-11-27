import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    hmr: {
      // Enable HMR for better hot-reload experience
      overlay: true,
    },
  },
  // Ensure fast refresh works for all files
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})

