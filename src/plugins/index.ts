import { App } from 'vue';
import ElementPlus from './el-element-plus.ts';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

export default {
  install: (app: App): void => {
    app.use(ElementPlus, { locale: zhCn });
  }
}
