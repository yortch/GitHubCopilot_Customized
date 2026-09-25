import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: [
        'src/api/config.ts',
        'src/context/{AuthContext,ThemeContext}.tsx',
        'src/components/Login.tsx',
        'src/components/admin/AdminProducts.tsx',
        'src/components/entity/product/{Products,ProductForm}.tsx',
      ],
      thresholds: { statements: 85, branches: 80, functions: 85, lines: 85 },
    },
  },
  server: {
    port: 5137,
    host: '0.0.0.0',
    strictPort: true,
  },
  define: {
    'process.env.CODESPACE_NAME': JSON.stringify(process.env.CODESPACE_NAME || ''),
  }
})
