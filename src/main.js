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
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
import hljs from 'highlight.js';
import vPreviewImage from 'v-preview-image'


VMdPreview.use(githubTheme, {
  Hljs: hljs,
});
VMdPreview.use(createLineNumbertPlugin());
VMdPreview.use(createCopyCodePlugin());


const app = createApp(App);

// 注册路由和 VMdEditor
app.use(router);
app.use(store);
app.use(VMdPreview)
app.use(vPreviewImage)
app.mount('#app');
