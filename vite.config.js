import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import.meta.env

export default defineConfig({
  plugins: [react()],
})
