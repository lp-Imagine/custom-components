import LpButton from './components/lp-button/index.js';
import LpTable from './components/lp-table/index.js';
import LpTablePage from './components/lp-table-page/index.js';
import LpRemoteSelect from './components/lp-remote-select/index.js';
import * as utils from './utils/index.js';

const components = [LpButton, LpTable, LpTablePage, LpRemoteSelect];
const install = function (Vue) {
    if (install.installed) return;
    for (const component of components) {
        Vue.component(component.name, component);
    }
};

if (typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
}

// 全局导出
export { utils, LpButton, LpTable, LpTablePage, LpRemoteSelect }
// 默认导出
export default { install, utils }