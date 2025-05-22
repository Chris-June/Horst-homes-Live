import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default defineConfig(({ mode }) => {
    // Load env file based on `mode`
    const env = loadEnv(mode, process.cwd(), '');
    return {
        base: '/',
        plugins: [react()],
        resolve: {
            alias: [
                { find: '@', replacement: path.resolve(__dirname, 'src') },
                { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
                { find: '@pages', replacement: path.resolve(__dirname, 'src/pages') },
                { find: '@lib', replacement: path.resolve(__dirname, 'src/lib') },
                { find: '@assets', replacement: path.resolve(__dirname, 'src/assets') },
                { find: '@contexts', replacement: path.resolve(__dirname, 'src/contexts') },
            ],
        },
        server: {
            port: 3001,
            strictPort: true,
            host: true,
            hmr: {
                clientPort: 3001,
            },
            open: true
        },
        define: {
            'process.env': env
        },
        build: {
            outDir: 'dist',
            assetsDir: 'assets',
            emptyOutDir: true,
            target: 'esnext',
            minify: 'esbuild',
            sourcemap: false,
            chunkSizeWarningLimit: 1000,
            reportCompressedSize: false,
            rollupOptions: {
                input: {
                    main: path.resolve(__dirname, 'index.html'),
                },
                output: {
                    manualChunks: (id) => {
                        if (id.includes('node_modules')) {
                            if (id.includes('react-dom') || id.includes('scheduler')) {
                                return 'vendor-react';
                            }
                            if (id.includes('@radix-ui') || id.includes('class-variance-authority') ||
                                id.includes('clsx') || id.includes('tailwind-merge')) {
                                return 'vendor-ui';
                            }
                            if (id.includes('framer-motion') || id.includes('popmotion')) {
                                return 'vendor-animations';
                            }
                            if (id.includes('lucide-react')) {
                                return 'vendor-icons';
                            }
                            if (id.includes('react-hook-form') || id.includes('@hookform')) {
                                return 'vendor-forms';
                            }
                            return 'vendor';
                        }
                        if (id.includes('src/')) {
                            const match = id.match(/src\/([^\/]+)/);
                            if (match) {
                                return `chunk-${match[1].toLowerCase()}`;
                            }
                        }
                    },
                    chunkFileNames: 'assets/[name]-[hash].js',
                    entryFileNames: 'assets/[name]-[hash].js',
                    assetFileNames: 'assets/[name]-[hash][extname]',
                },
            },
        },
        optimizeDeps: {
            exclude: ['lucide-react'],
        },
    };
});
