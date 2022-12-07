
import css from 'rollup-plugin-import-css'

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/asg-sticky-tabs.min.js',
      format: 'iife',
      name: 'ASGStickyTabs'
    },
    plugins: [
      css({ output: 'asg-sticky-tabs.min.css' })
    ]
  },
  {
    input: 'src/index2.js',
    output: {
      file: 'dist/asg-sticky-tabs.min.js',
      format: 'iife',
      name: 'ASGStickyTabs'
    },
    plugins: [
      css({ output: 'asg-sticky-tabs-2.min.css' })
    ]
  }
]
