import LpButton from './index.vue'
import type { App } from 'vue'

LpButton.install = function (Vue: App) {
    if (LpButton.name) {
        Vue.component(LpButton.name, LpButton);
    }
};

export default LpButton;