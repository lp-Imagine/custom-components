import vue from 'rollup-plugin-vue'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import scss from 'rollup-plugin-scss'
import sass from 'sass'
import json from '@rollup/plugin-json' // 引入 json 插件

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
  external: ['vue', 'element-plus', '@element-plus/icons-vue'],
  plugins: [
    vue(),
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [['@babel/preset-env', { modules: false }]],
    }),
    scss({
      // 指定 sass 编译器
      compiler: sass,
      // 输出 CSS 文件的路径
      output: 'dist/bundle.css',
      // 其他选项
      includePaths: ['src/styles'],
      sourceMap: true,
    }),
    terser(),
    json(),
  ]
}