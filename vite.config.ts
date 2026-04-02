import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('/reactflow/') || id.includes('/recharts/')) {
            return 'vendor-viz';
          }

          if (
            id.includes('/react-dnd/') ||
            id.includes('/react-dnd-html5-backend/') ||
            id.includes('/dnd-core/')
          ) {
            return 'vendor-dnd';
          }

          if (id.includes('/@radix-ui/') || id.includes('/cmdk/') || id.includes('/vaul/')) {
            return 'vendor-ui';
          }

          if (id.includes('/date-fns/') || id.includes('/react-day-picker/')) {
            return 'vendor-date';
          }
        },
      },
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
