import LpRemoteSelect from './index.vue'
import { App } from 'vue'

LpRemoteSelect.install = function (Vue: App) {
    if (LpRemoteSelect.name) {
        Vue.component(LpRemoteSelect.name, LpRemoteSelect);
    }
};

export default LpRemoteSelect;