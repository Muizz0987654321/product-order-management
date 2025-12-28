import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@components', replacement: '/src/components' },
      { find: '@types', replacement: '/src/types' },
      { find: '@store', replacement: '/src/store' },
      { find: '@features', replacement: '/src/features' },
      { find: '@pages', replacement: '/src/pages' },
      { find: '@services', replacement: '/src/services' },
    ],
  },
  build: {
    chunkSizeWarningLimit: 1500,
  },
})
