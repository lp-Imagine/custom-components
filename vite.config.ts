import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { terser } from 'rollup-plugin-terser'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // 使用 path.resolve 解析路径
    },
  },
  plugins: [vue(), terser()],
  build: {
    lib: {
      entry: path.resolve(__dirname, '/packages/index.ts'),  // 打包入口文件
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