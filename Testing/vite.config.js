import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages:
// base must match the repository name
export default defineConfig({
  plugins: [react()],
  base: '/nullbyte-academy/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})
