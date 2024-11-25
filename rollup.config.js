import vue from 'rollup-plugin-vue'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import json from '@rollup/plugin-json' // 引入 json 插件

export default {
  input: 'packages/index.ts',
  output: [
    {
      format: 'cjs',
      file: 'dist/custom-components.cjs.js'
    },
    {
      format: 'esm',
      file: 'dist/custom-components.esm.js'
    }
  ],
  external: ['vue', 'bignumber.js', 'element-plus', '@element-plus/icons-vue',],
  plugins: [
    vue(),
    resolve({
      moduleDirectories: ['node_modules', 'src'],
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [['@babel/preset-env', { modules: false }]],
    }),
    postcss({
      extract: true,
      minimize: true,
      use: [
        ['sass', { includePaths: ['packages/styles'] }]
      ],
      extensions: ['.scss', '.css'],
      plugins:[autoprefixer],
      output: 'dist/custom-components.css'
    }),
    terser(),
    json(),
  ]
}