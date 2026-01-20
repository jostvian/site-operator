import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            '/ag_ui': {
                target: 'http://localhost:8001',
                changeOrigin: true,
            },
            '/api/conversations': {
                target: 'http://localhost:8001',
                changeOrigin: true,
            }
        },
        sourcemapIgnoreList: (path) => path.includes('node_modules')
    },
    build: {
        sourcemap: true,
        lib: {
            entry: 'src/index.ts',
            name: 'SiteOperator',
            fileName: (format) => `site-operator.${format}.js`
        },
        rollupOptions: {
            external: ['@ag-ui/client'],
            output: {
                globals: {
                    '@ag-ui/client': 'AgUiClient'
                }
            }
        }
    },
    plugins: [dts({ rollupTypes: true })]
})
