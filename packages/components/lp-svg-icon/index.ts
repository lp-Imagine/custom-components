import LpSvgIcon from './index.vue'
import { App } from 'vue'
import 'virtual:svg-icons-register'

LpSvgIcon.install = function (Vue: App) {
    if (LpSvgIcon.name) {
        Vue.component(LpSvgIcon.name, LpSvgIcon);
    }
};

export default LpSvgIcon;