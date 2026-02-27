import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages:
// base must match the repository name
export default defineConfig({
  plugins: [react()],
  base: '/Course-NullByte/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})