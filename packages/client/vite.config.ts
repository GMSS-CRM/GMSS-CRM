import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()] as any,
  optimizeDeps: {
    // Force Vite to pre-bundle @gmss/types so its CJS output is converted to ESM.
    // Without this, Vite serves the symlinked workspace package as raw CJS,
    // and named exports (e.g. `Permission`) are not visible to ESM imports.
    include: ['@gmss/types'],
  },
})
