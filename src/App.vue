<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex"; // 引入 Vuex store
import GlobalLoading from "@/components/GlobalLoading.vue";
import { loadingState } from "@/stores/loading";

const router = useRouter();
const store = useStore(); // 使用 Vuex store
const isContentLoaded = ref(false); // 标志内容是否加载完成

// 监听路由变化
watch(
  () => router.currentRoute.value,
  async () => {
    loadingState.show("正在加载页面...");
    isContentLoaded.value = false; // 切换路由时，重置加载状态
    try {
      // 加载 Main 组件的 Markdown 文件
      if (router.currentRoute.value.name === "Main") {
        await loadMarkdownFiles(); // 加载 Markdown 文件
      }
    } finally {
      loadingState.hide();
      isContentLoaded.value = true; // 加载完成
    }
  }
);

// 页面加载时的首次加载处理
onMounted(async () => {
  loadingState.show("正在加载页面...");
  try {
    await loadMarkdownFiles(); // 初次加载时加载 Markdown 文件
  } finally {
    loadingState.hide();
    isContentLoaded.value = true; // 加载完成
  }
});

// 加载 Markdown 文件的函数
const loadMarkdownFiles = async () => {
  await store.dispatch("loadMarkdownFiles"); // 通过 Vuex 动作加载文件
};
</script>

<template>
  <GlobalLoading />
  <div v-if="isContentLoaded">
    <!-- 传递 markdownFiles 到 Main 组件 -->
    <router-view :markdownFiles="store.state.markdownFiles" />
  </div>
</template>

<style>
@import "@/assets/font/font.css";

* {
  padding: 0;
  margin: 0;
}
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
