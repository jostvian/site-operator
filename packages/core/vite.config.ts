import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
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
