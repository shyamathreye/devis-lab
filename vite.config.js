import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the built site works when opened from any path/host.
export default defineConfig({
  base: './',
  plugins: [react()],
})
