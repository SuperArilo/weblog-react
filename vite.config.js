import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        viteCompression({
            verbose: true,
            disable: false,
            threshold: 512,
            algorithm: 'gzip',
            ext: '.gz',
            deleteOriginFile: false
        })
    ],
    server: {
        port: 3333
    },
    terserOptions: {
        compress: {
            drop_console: true,
            drop_debugger: true
        }
    },
    build: {
        rollupOptions: {
          output: {
            chunkFileNames: 'js/[name].js',
            entryFileNames: 'js/[name].js',
            assetFileNames: '[ext]/[name]-[hash].[ext]',
          }
        }
    }
})
