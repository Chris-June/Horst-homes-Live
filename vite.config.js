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
        server: {
            // This ensures all routes fall back to index.html
            proxy: {
                '^/(?!@vite|@id|node_modules|src|assets|api).*': {
                    target: 'http://localhost:5173',
                    rewrite: () => '/index.html',
                },
            },
        },
        define: {
            'process.env': env
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@components': path.resolve(__dirname, 'src/components'),
                '@pages': path.resolve(__dirname, 'src/pages'),
                '@lib': path.resolve(__dirname, 'src/lib'),
                '@assets': path.resolve(__dirname, 'src/assets'),
            },
        },
        build: {
            outDir: 'dist',
            assetsDir: 'assets',
            emptyOutDir: true,
            target: 'esnext',
            minify: 'esbuild',
            sourcemap: false,
            chunkSizeWarningLimit: 1000, // Increase warning limit to 1000KB
            reportCompressedSize: false, // Disable gzip size reporting for better performance
            rollupOptions: {
                input: {
                    main: path.resolve(__dirname, 'index.html'),
                },
                output: {
                    manualChunks: (id) => {
                        // Create separate chunks for large dependencies
                        if (id.includes('node_modules')) {
                            // Group React and related libraries
                            if (id.includes('react-dom') || id.includes('scheduler')) {
                                return 'vendor-react';
                            }
                            // Group UI libraries
                            if (id.includes('@radix-ui') || id.includes('class-variance-authority') ||
                                id.includes('clsx') || id.includes('tailwind-merge')) {
                                return 'vendor-ui';
                            }
                            // Group animation libraries
                            if (id.includes('framer-motion') || id.includes('popmotion')) {
                                return 'vendor-animations';
                            }
                            // Group icon libraries
                            if (id.includes('lucide-react')) {
                                return 'vendor-icons';
                            }
                            // Group form handling libraries
                            if (id.includes('react-hook-form') || id.includes('@hookform')) {
                                return 'vendor-forms';
                            }
                            // Group remaining node_modules into vendor
                            return 'vendor';
                        }
                        // Split code from src into chunks based on directory structure
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
