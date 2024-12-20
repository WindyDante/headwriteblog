<template>
  <div class="content-wrapper">
    <!-- 锚点导航 -->
    <nav class="anchor-navigation" v-if="isDesktop">
      <div
        v-for="anchor in titles"
        :key="anchor.lineIndex"
        :style="{ paddingLeft: `${anchor.indent * 20}px` }"
        class="anchor-item"
        @click="handleAnchorClick(anchor)"
      >
        <a style="cursor: pointer">{{ anchor.title }}</a>
      </div>
    </nav>
    <!-- TODO 手机端文章过窄 
    TODO 字体采用system-ui or sans-serif
     -->
    <!-- 主内容 -->
    <div class="content-container">
      <header class="content-header">
        <h1 class="article-title">{{ article.title }}</h1>
        <p class="article-date">发布日期：{{ article.date }}</p>
      </header>
      <v-md-preview
        ref="previewRef"
        @copy-code-success="handleCopyCodeSuccess"
        v-if="article.content"
        :text="article.content"
        :key="article.title"
      ></v-md-preview>
      <p v-else>加载中...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

export default {
  setup() {
    const route = useRoute();
    const store = useStore();
    const date = JSON.parse(sessionStorage.getItem("markdownFiles")).find(
      (item) => item.title === route.params.title
    ).date;
    const article = ref({
      title: route.params.title || "无标题",
      date:
        new Date(date).toLocaleDateString("zh-CN", {
          timeZone: "Asia/Shanghai",
        }) || "未知日期",
      content: "",
    });
    const titles = ref([]);
    const previewRef = ref(null); // 引用 v-md-preview 组件

    const isDesktop = ref(true); // 用于判断是否为桌面设备

    // 判断是否为桌面设备
    const checkIfDesktop = () => {
      isDesktop.value = window.innerWidth >= 1024;
    };

    // 监听窗口大小变化
    window.addEventListener("resize", checkIfDesktop);
    onMounted(checkIfDesktop); // 初始化时检查设备

    const loadFromCache = (title) => {
      const cachedArticle = sessionStorage.getItem(`article-${title}`);
      return cachedArticle ? JSON.parse(cachedArticle) : null;
    };

    const handleCopyCodeSuccess = () => {
      console.log("复制成功");
    };

    const loadArticleContent = async (title) => {
      const cachedArticle = loadFromCache(title);
      if (cachedArticle) {
        article.value = cachedArticle;
      } else {
        const matchingArticle = store.state.markdownFiles.find(
          (file) => file.title === title
        );
        if (matchingArticle) {
          article.value = {
            title: matchingArticle.title,
            date: article.value.date,
            content: matchingArticle.content,
          };
          sessionStorage.setItem(
            `article-${title}`,
            JSON.stringify(article.value)
          );
        } else {
          article.value.content = "文章未找到";
        }
      }
    };

    const handleAnchorClick = (anchor) => {
      const preview = previewRef.value;
      const { lineIndex } = anchor;

      const heading = preview.$el.querySelector(
        `[data-v-md-line="${lineIndex}"]`
      );
      if (heading) {
        preview.scrollToTarget({
          target: heading,
          scrollContainer: window,
          top: 60,
        });
      }
    };

    const generateAnchors = () => {
      const preview = previewRef.value; // 获取组件实例
      if (!preview) return;

      const previewEl = preview.$el; // 获取 DOM 元素
      if (!previewEl) return;

      const anchors = previewEl.querySelectorAll("h1, h2, h3, h4, h5, h6");
      const filteredAnchors = Array.from(anchors).filter((el) =>
        el.innerText.trim()
      );
      if (!filteredAnchors.length) return;

      const hTags = Array.from(
        new Set(filteredAnchors.map((el) => el.tagName))
      ).sort();
      titles.value = filteredAnchors.map((el) => ({
        title: el.innerText,
        lineIndex: el.getAttribute("data-v-md-line"),
        indent: hTags.indexOf(el.tagName),
      }));
    };

    const addFancyboxToImages = () => {
      // 为所有图片添加 data-fancybox 属性
      const images = previewRef.value?.$el.querySelectorAll("img");
      images?.forEach((img) => {
        img.setAttribute("data-fancybox", "gallery");
      });

      // 初始化 Fancybox
      Fancybox.bind('[data-fancybox="gallery"]', {
        // Optional: Customize Fancybox options here
      });
    };

    onMounted(() => {
      if (route.params.title) {
        loadArticleContent(route.params.title).then(() => {
          nextTick(() => {
            generateAnchors(); // 确保组件渲染后再生成锚点
            addFancyboxToImages(); // 为图片添加 Fancybox 属性
          });
        });
      }
    });

    watch(
      () => article.value.content,
      (newContent) => {
        if (newContent) {
          nextTick(() => {
            generateAnchors(); // 在内容更新后生成锚点
            addFancyboxToImages(); // 重新为图片添加 Fancybox 属性
          });
        }
      }
    );

    return {
      article,
      titles,
      handleCopyCodeSuccess,
      handleAnchorClick,
      previewRef, // 绑定到 v-md-preview
      isDesktop,
    };
  },
};
</script>



<style scoped>
/* 基本样式 */
.content-wrapper {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
}

.content-container {
  flex: 1;
  padding: 20px;
  max-width: 85%;
  box-sizing: border-box;
}

.article-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.article-date {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;
}

/* 锚点导航样式 */
.anchor-navigation {
  width: 15%;
  padding: 20px;
  border-right: 1px solid #ddd;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  background-color: #f9f9f9;
}

.anchor-item {
  margin-bottom: 10px;
}

.anchor-item a {
  text-decoration: none;
  color: #007bff;
  font-size: 1rem;
}

.anchor-item a:hover {
  text-decoration: underline;
}

/* 移动端和桌面端自适应 */
@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
  }

  .anchor-navigation {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #ddd;
    position: relative;
  }

  .anchor-item {
    display: inline-block;
    margin-right: 15px;
  }
}

@media (max-width: 600px) {
  .content-container {
    padding: 10px;
  }

  .article-title {
    font-size: 1.2rem;
  }

  .article-date {
    font-size: 0.9rem;
  }

  .anchor-item a {
    font-size: 0.9rem;
  }
}
</style>
