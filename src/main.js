import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// main.js
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
// 引入你所使用的主题 此处以 github 主题为例
import githubTheme from '@kangc/v-md-editor/lib/theme/github';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import store from '@/store';

// highlightjs
import hljs from 'highlight.js';

VMdPreview.use(githubTheme, {
  Hljs: hljs,
});

const app = createApp(App);

// 注册路由和 VMdEditor
app.use(router);
app.use(store);
app.use(VMdPreview)
app.mount('#app');