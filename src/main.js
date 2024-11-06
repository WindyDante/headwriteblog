import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// 导入 v-md-editor 及其样式
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';

// 导入 GitHub 主题
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// 导入 highlight.js
import hljs from 'highlight.js';

// 使用 GitHub 主题和 highlight.js
VMdEditor.use(githubTheme, {
  Hljs: hljs, // 配置语法高亮插件
});

const app = createApp(App);

// 注册路由和 VMdEditor
app.use(router);
app.use(VMdEditor);

app.mount('#app');
