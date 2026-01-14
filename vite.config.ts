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
            // Externalize deps that shouldn't be bundled?
            // For a "vanilla js" drop-in widget, we usually want to bundle everything except maybe peerDeps if expected.
            // But let's bundle everything for simplicity of use as a single script tag or import.
            // If the user wants it to be framework agnostic and easy to use, bundling Lit is often preferred 
            // unless they are already a Lit shop. I'll keep it bundled for now.
        }
    },
    plugins: [dts({ rollupTypes: true })]
})
