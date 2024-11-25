import LpSearchForm from './index.vue'
import { App } from 'vue'

LpSearchForm.install = function (Vue: App) {
    if (LpSearchForm.name) {
        Vue.component(LpSearchForm.name, LpSearchForm);
    }
};

export default LpSearchForm;