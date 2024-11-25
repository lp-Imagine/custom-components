import LpTable from './index.vue'
import { App } from 'vue'

LpTable.install = function (Vue: App) {
    if (LpTable.name) {
        Vue.component(LpTable.name, LpTable);
    }
};

export default LpTable;