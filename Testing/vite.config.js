import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vercel serves from the root '/', no subpath
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})
