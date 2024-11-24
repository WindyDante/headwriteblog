<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex"; // 引入 Vuex store
import GlobalLoading from "@/components/GlobalLoading.vue";
import { loadingState } from "@/stores/loading";

const router = useRouter();
const store = useStore(); // 使用 Vuex store
const isContentLoaded = ref(false); // 标志内容是否加载完成

// 确保数据加载完成并更新视图
const ensureDataLoaded = async () => {
  if (store.state.markdownFiles.length === 0) {
    // 仅在数据未加载时调用加载函数
    await store.dispatch("loadMarkdownFiles");
  }
};

// 监听路由变化
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

// 页面加载时的首次加载处理
onMounted(async () => {
  loadingState.show("正在加载页面...");
  try {
    await ensureDataLoaded(); // 确保数据加载完成
    console.log("app组件完成");
  } finally {
    loadingState.hide();
    isContentLoaded.value = true; // 标记加载完成
  }
});
</script>


<template>
  <GlobalLoading />
  <div v-if="isContentLoaded">
    <!-- 不再传递 markdownFiles -->
    <router-view />
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
