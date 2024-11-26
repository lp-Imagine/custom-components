import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { terser } from 'rollup-plugin-terser'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons' // 引入svg插件

// 配置路径
const pathResolve = (pathStr) => {
  return path.resolve(__dirname, pathStr)
}

  // https://vite.dev/config/
  export default defineConfig({
    resolve: {
      alias: {
        '@': pathResolve('src'),  // 使用 path.resolve 解析路径
      },
    },
    plugins: [vue(), createSvgIconsPlugin({
      // 指定需要缓存的svg图标文件夹，即需要识别的svg都应该放在这个文件夹下
      // iconDirs: [path.resolve(process.cwd(), 'src/assets/svgs')],
      // 或
      iconDirs: [pathResolve('./src/assets/svgs')],
      // 指定symbolId格式（这里的配置与6.2步骤中的引入svg组件的name配置项写法有关）
      symbolId: 'icon-[dir]-[name]',
    }),
    terser()
    ],
    build: {
      lib: {
        entry: pathResolve('/packages/index.ts'),  // 打包入口文件
        name: 'custom-components',    // 打包的名字
        fileName: (format) => `custom-components.${format}.js`  // 打包生成的文件名
      },
      rollupOptions: {
        // 不需要打包进库的依赖，忽略vue
        external: ['vue', 'bignumber.js', 'element-plus', '@element-plus/icons-vue'],
        // input: 'src/main.ts',
        output: {
          // UMD构建模式下为这些外部的依赖提供一个全局变量
          globals: {
            vue: 'Vue'
          },
          // 启用代码分割
          // chunkFileNames: 'chunks/[name]-[hash].js',
          // entryFileNames: '[name]-[hash].js',
          // assetFileNames: '[name]-[hash].[ext]'
        },
        // Tree Shaking 配置
        treeshake: {
          moduleSideEffects: 'no-external',
        },
        // 启用 sourcemaps
        sourcemap: true,
        // 压缩 CSS
        cssCodeSplit: true,
        // 压缩 HTML
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,  // 移除 console 语句
            drop_debugger: true  // 移除 debugger 语句
          }
        }
      },

    }
  })