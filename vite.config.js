import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // <-- Fix: plugin-react instead of react-plugin

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true
  }
})