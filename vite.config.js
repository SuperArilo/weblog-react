import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import svgr from "vite-plugin-svgr"
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        svgr(),
        viteCompression({
            verbose: true,
            disable: false,
            threshold: 10240,
            algorithm: 'gzip',
            ext: '.gz',
            deleteOriginFile: false
        }),
    ],
    server: {
        port: 3333,
        https: false
    },
    build: {
        minify: "terser",
        rollupOptions: {
            output: {
                entryFileNames: 'js/[name].js',
                chunkFileNames: 'js/[name].js',
                assetFileNames: 'staticFiles/[name][extname]',
                manualChunks: id => {
                    if (id.includes('node_modules')) {
                        return 'vendor'
                    }
                }
            },
        }
    },
    terserOptions: {
        compress: {
            drop_console: process.env.NODE_ENV === 'production',
            drop_debugger: process.env.NODE_ENV === 'production'
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler', // or 'modern'
            }
        }
    }
})
