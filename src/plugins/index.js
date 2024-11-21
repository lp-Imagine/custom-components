import ElementPlus from './el-element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn'

export default {
  install: (app) => {
    app.use(ElementPlus, { locale: zhCn });
  }
}
