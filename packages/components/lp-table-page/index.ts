import LpTablePage from './index.vue'
import { App } from 'vue'

LpTablePage.install = function (Vue: App) {
    if (LpTablePage.name) {
        Vue.component(LpTablePage.name, LpTablePage);
    }
};

export default LpTablePage;