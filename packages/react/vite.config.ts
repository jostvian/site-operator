import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'SiteOperatorReact',
      fileName: (format) => `site-operator-react.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'site-operator'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'site-operator': 'SiteOperator'
        }
      }
    }
  }
})
