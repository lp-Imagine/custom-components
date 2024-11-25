import LpButton from './components/lp-button/index.ts';
import LpTable from './components/lp-table/index.ts';
import LpTablePage from './components/lp-table-page/index.ts';
import LpRemoteSelect from './components/lp-remote-select/index.ts';
import LpSearchForm from './components/lp-search-form/index.ts';
import * as utils from './utils/index.js';

const components = [LpButton, LpTable, LpTablePage, LpRemoteSelect, LpSearchForm];
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
export { utils, LpButton, LpTable, LpTablePage, LpRemoteSelect, LpSearchForm }
// 默认导出
export default { install, utils }