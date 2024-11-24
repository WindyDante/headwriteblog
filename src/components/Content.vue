<template>
  <div class="content-container">
    <header class="content-header">
      <h1 class="article-title">{{ article.title }}</h1>
      <p class="article-date">发布日期：{{ article.date }}</p>
    </header>
    <!-- 使用 markdown 编辑器，切换为预览模式 -->
    <v-md-preview
      v-if="article.content"
      :text="article.content"
      :key="article.title"
    ></v-md-preview>
    <p v-else>加载中...</p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default {
  setup() {
    const route = useRoute();
    const store = useStore();
    const article = ref({
      title: route.params.title || "无标题",
      date: route.params.date || "未知日期",
      content: "",
    });

    const loadFromCache = (title) => {
      const cachedArticle = sessionStorage.getItem(`article-${title}`);
      return cachedArticle ? JSON.parse(cachedArticle) : null;
    };

    const loadArticleContent = async (title) => {
      const cachedArticle = loadFromCache(title);

      if (cachedArticle) {
        article.value = cachedArticle;
      } else {
        // 从 Vuex 获取文章内容
        const matchingArticle = store.state.markdownFiles.find(
          (file) => file.title === title
        );
        if (matchingArticle) {
          article.value = {
            title: matchingArticle.title,
            date: article.value.date,
            content: matchingArticle.content,
          };
          // 将文章内容存入缓存
          sessionStorage.setItem(
            `article-${title}`,
            JSON.stringify(article.value)
          );
        } else {
          article.value.content = "文章未找到";
        }
      }
    };

    onMounted(() => {
      if (route.params.title) {
        loadArticleContent(route.params.title);
      }
    });

    return {
      article,
    };
  },
};
</script>

<style scoped>
.content-header {
  padding-top: 20px;
  text-align: center;
}

.v-md-editor {
  color: #801dae;
}

/* 确保使用 ::v-deep 来穿透组件的样式 */
.v-md-editor ::v-deep img.loading {
  background-image: url("@/assets/img/loading.gif");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  height: 200px;
  width: 100%;
  display: block;
  opacity: 0.6; /* 加入透明度，给 loading 效果 */
  transition: opacity 0.5s ease; /* 过渡效果 */
}

.v-md-editor ::v-deep img.error {
  background-image: url("@/assets/img/loading.gif"); /* 错误图标 */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  height: 200px;
  width: 100%;
  display: block;
}

/* 图片样式 */
.v-md-editor ::v-deep img {
  display: block;
  width: auto;
  transition: opacity 0.5s ease;
}

/* 图片容器样式 */
.content-container {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 15px;
}

@media (max-width: 767px) {
  .content-container {
    padding: 15px;
  }
}

/* 高亮的代码块样式 */
.highlight {
  background-color: #f6f8fa;
  border-radius: 5px;
  padding: 10px;
  overflow-x: auto;
}

.highlight pre {
  background: none;
  border: none;
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
