import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

//Solucionar error de tailwind npm install -D tailwindcss@3.4.0 postcss autoprefixer