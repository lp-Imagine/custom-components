import { createApp } from 'vue';
import App from './App.vue';
import plugins from './plugins/index';

// import { LpButton, LpTable } from '../packages/index'
import LpCustomComponents from '../packages/index';

const app = createApp(App);
app.use(plugins);
// app.use(LpButton)
// app.use(LpTable)
app.use(LpCustomComponents);
app.mount('#app');