import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '3f4286a9e84b.ngrok-free.app', // your ngrok URL
      'localhost',                   // keep localhost for dev
    ],
  },
})
