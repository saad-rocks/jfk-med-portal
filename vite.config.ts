import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Enable hot module replacement
    hmr: true,
    // Watch for file changes
    watch: {
      usePolling: false,
      interval: 100
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and related libraries
          react: ['react', 'react-dom', 'react-router-dom'],
          // Firebase chunk
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage', 'firebase/functions'],
          // UI library chunks
          icons: ['lucide-react'],
          // Utils chunk
          utils: ['clsx', 'class-variance-authority']
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 600,
    // Enable source maps for debugging in production
    sourcemap: false,
    // Minify for production
    minify: 'terser',
    // Target modern browsers for smaller bundles
    target: 'es2020'
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'firebase/app', 'firebase/auth']
  },
  // Environment variable handling
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
  // Resolve aliases
  resolve: {
    alias: {
      '@': '/src',
      '@/components': '/src/components',
      '@/lib': '/src/lib',
      '@/hooks': '/src/hooks',
      '@/types': '/src/types'
    }
  }
})
