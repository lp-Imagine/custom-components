import vue from 'rollup-plugin-vue'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import scss from 'rollup-plugin-scss'
import sass from 'sass'

export default {
  input: 'src/index.js',
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
  plugins: [
    vue(),
    resolve(),
    commonjs(),
    babel({ babelHelpers: 'bundled' }),
    scss({
      // 指定 sass 编译器
      compiler: sass,
      // 输出 CSS 文件的路径
      output: 'dist/bundle.css',
      // 其他选项
      includePaths: ['src/styles'],
      sourceMap: true,
    }),
    terser()
  ]
}