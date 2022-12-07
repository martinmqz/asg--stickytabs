import { terser } from 'rollup-plugin-terser'
import css from 'rollup-plugin-import-css'

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/asg-sticky-tabs.min.js',
      sourcemap: 'asg-sticky-tabs.min.map',
      format: 'iife',
      name: 'ASGtickyTabs'
    },
    plugins: [
      terser(),
      css({ output: 'asg-sticky-tabs.min.css', minify: true })
    ]
  }
]
