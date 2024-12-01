<template>
  <div class="rss-generator">
    <button @click="generateRSS">生成 RSS</button>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { Feed } from "feed";
import { computed } from "vue";
import { ar } from "../../docs/assets/@vue-CyONiH4Q";

// 获取 Vuex store
const store = useStore();

// 动态获取文章列表数据
const articles = computed(() => store.state.markdownFiles);

// 获取当前页面的 base URL
const getBaseURL = () => window.location.origin + window.location.pathname;

const generateRSS = () => {
  // 获取当前页面的 URL
  const baseURL = getBaseURL();

  const feed = new Feed({
    title: "江湖夜雨十年灯",
    description: "江湖故事集",
    id: baseURL, // 使用当前页面 URL 作为 ID
    link: baseURL, // 使用当前页面 URL 作为链接
    language: "zh-CN",
    copyright: `版权所有 © ${new Date().getFullYear()} 江湖夜雨十年灯`,
    generator: "Feed for Vue.js RSS Generator",
  });

  // 遍历文章并生成 RSS 条目
  articles.value.forEach((article) => {
    console.log(article);
    // 生成每篇文章的链接，基于当前页面的 URL
    const articleLink = `${baseURL}#/content/${encodeURIComponent(
      article.name
    )}`;

    feed.addItem({
      title: article.title,
      id: articleLink,
      link: articleLink,
      date: new Date(article.created),
      description: article.title,
    });
  });

  // 生成 RSS 内容
  const rssContent = feed.rss2();

  // 创建一个 Blob 对象，并生成一个临时 URL
  const blob = new Blob([rssContent], { type: "application/rss+xml" });
  const url = URL.createObjectURL(blob);

  // 打开新的窗口以显示生成的 RSS 文件
  window.open(url, "_blank");
};
</script>

<style scoped>
.rss-generator {
  margin-bottom: 20px;
}

button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}
</style>
