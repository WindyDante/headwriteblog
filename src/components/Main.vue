<script setup>
import { useStore } from "vuex"; // 引入 Vuex store
import { useRouter } from "vue-router"; // 引入 Vue Router
import { ref, onMounted, watch } from "vue";
import { loadingState } from "@/stores/loading";
import GlobalLoading from "@/components/GlobalLoading.vue"; // 引入全局加载组件

const store = useStore();
const router = useRouter();

// 用于存储文章数据
const markdownFiles = ref([]);
const isContentLoaded = ref(false); // 标志内容是否加载完成

// 从缓存中获取数据
const loadFromCache = () => {
  const cachedData = sessionStorage.getItem("markdownFiles");
  return cachedData ? JSON.parse(cachedData) : null;
};

// 确保数据加载完成并更新视图
const ensureDataLoaded = async () => {
  if (store.state.markdownFiles.length === 0) {
    // 仅在数据未加载时调用加载函数
    await store.dispatch("loadMarkdownFiles");
  }
  const cachedData = loadFromCache();
  if (cachedData) {
    markdownFiles.value = cachedData; // 使用缓存数据
  } else {
    markdownFiles.value = store.state.markdownFiles.map((file) => ({
      name: file.name,
      date: file.created,
      title: file.title,
      daysAgo: file.daysAgo,
    }));
    sessionStorage.setItem(
      "markdownFiles",
      JSON.stringify(markdownFiles.value)
    ); // 存入缓存
  }
};

// 跳转到文章页面
const goToArticle = (file) => {
  router.push({
    name: "Content",
    params: {
      title: file.title, // 传递标题
      date: file.date, // 传递日期
    },
  });
};

// 监听路由变化，加载数据
watch(
  () => router.currentRoute.value,
  async () => {
    loadingState.show("正在加载页面...");
    isContentLoaded.value = false; // 重置加载状态
    try {
      if (router.currentRoute.value.name === "Main") {
        await ensureDataLoaded(); // 确保数据加载完成
      }
    } finally {
      loadingState.hide();
      isContentLoaded.value = true; // 标记加载完成
    }
  }
);

// 初始化加载
onMounted(async () => {
  loadingState.show("正在加载页面...");
  try {
    await ensureDataLoaded(); // 确保数据加载完成
  } catch {
    console.error("加载失败");
  } finally {
    loadingState.hide();
    isContentLoaded.value = true; // 标记加载完成
  }
});
</script>

<template>
  <div class="blog-container">
    <header class="blog-header">
      <h1>江湖夜雨十年灯</h1>
      <p>一壶浊酒尽余欢，今宵别梦寒。</p>
    </header>
    <GlobalLoading />
    <ul class="blog-list" v-if="isContentLoaded">
      <li
        v-for="file in markdownFiles"
        :key="file.name"
        @click="goToArticle(file)"
      >
        <h2>{{ file.title }}</h2>
        <p>{{ file.daysAgo }} 天前</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.blog-container {
  background-size: cover;
  padding: 20px;
}

.blog-header {
  text-align: center;
  margin-bottom: 20px;
}

.blog-header h1 {
  font-size: 2.5em;
}

.blog-header p {
  font-size: 1.2em;
}

.blog-list {
  text-align: center;
  list-style: none;
  padding: 0;
}

.blog-list li {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.blog-list h2 {
  margin: 0;
  font-size: 1.5em;
}

.blog-list p {
  margin: 0;
  font-size: 0.9em;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .blog-header h1 {
    font-size: 2em;
  }

  .blog-header p {
    font-size: 1em;
  }

  .blog-list h2 {
    font-size: 1.25em;
  }

  .blog-list p {
    font-size: 0.8em;
  }
}

@media (max-width: 480px) {
  .blog-header h1 {
    font-size: 1.5em;
  }

  .blog-header p {
    font-size: 0.9em;
  }

  .blog-list h2 {
    font-size: 1.1em;
  }

  .blog-list p {
    font-size: 0.7em;
  }
}
</style>
