<template>
  <div class="content-container">
    <header class="content-header">
      <h1 class="article-title">{{ article.title }}</h1>
      <p class="article-date">发布日期：{{ article.date }}</p>
    </header>
    <!-- 使用 markdown 编辑器，切换为预览模式 -->
    <v-md-editor
      class="markdown-content"
      mode="preview"
      v-model="article.content"
    ></v-md-editor>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from "vue";
import markdownIt from "markdown-it";

export default {
  props: ["fileName"],
  setup(props) {
    const article = ref({
      title: "",
      date: "",
      content: "",
    });

    // 加载文章内容
    const loadArticle = async (fileName) => {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}markdowns/${encodeURIComponent(fileName)}`
        );
        const data = await response.text();

        // 提取标题和日期
        const titleMatch = data.match(/title:\s*(.*)/);
        const dateMatch = data.match(/date:\s*(.*)/);

        // 去除 metadata 部分，渲染 markdown
        const contentWithoutMetadata = data
          .replace(/---[\s\S]*?---/, "")
          .trim();
        const contentHtml = renderMarkdown(contentWithoutMetadata);

        article.value = {
          title: titleMatch ? titleMatch[1].trim() : fileName,
          date: dateMatch ? dateMatch[1].trim() : "未知",
          content: contentHtml,
        };

        await nextTick(() => {
          applyImageResizing(); // 等待渲染完成后处理图片大小
        });
      } catch (error) {
        console.error("Error loading article:", error);
      }
    };

    // 渲染 markdown
    const renderMarkdown = (markdownText) => {
      const markdownItInstance = markdownIt({
        html: true, // 允许渲染 HTML 标签
      });

      return markdownItInstance.render(markdownText);
    };

    // 图片加载时处理宽度调整
    const applyImageResizing = () => {
      const images = document.querySelectorAll(".v-md-editor img");
      images.forEach((img) => {
        img.classList.add("loading"); // 显示 loading 动画
        img.addEventListener("load", () => {
          img.classList.remove("loading"); // 图片加载完成后移除 loading 动画

          const containerWidth = img.parentElement.offsetWidth; // 容器宽度
          const imgWidth = img.naturalWidth; // 图片的原始宽度

          // 如果图片宽度大于容器，则设置为 100%
          if (imgWidth > containerWidth) {
            img.style.width = "100%";
          }
        });

        img.addEventListener("error", () => {
          img.classList.remove("loading"); // 图片加载失败移除 loading 动画
          img.classList.add("error"); // 加入错误的样式类
          img.alt = "图片加载失败"; // 显示错误信息
        });
      });
    };

    onMounted(() => {
      loadArticle(props.fileName); // 加载文章
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
