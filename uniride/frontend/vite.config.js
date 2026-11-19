import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// O React roda em http://localhost:5173 e a API PHP roda no XAMPP (Apache).
// O "proxy" repassa tudo que começa com /api para a pasta do back-end no XAMPP.
// Assim o React e o PHP ficam no mesmo endereço e a sessão de login funciona.
const XAMPP = process.env.XAMPP_URL || 'http://localhost'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: XAMPP,
        changeOrigin: true,
        rewrite: (caminho) => caminho.replace(/^\/api/, '/uniride/backend/api'),
      },
    },
  },
})
