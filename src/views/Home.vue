<script setup>
import { useRoute } from "vue-router";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

const route = useRoute(); // 引入当前路由对象
</script>

<template>
  <div>
    <keep-alive>
      <Header />
    </keep-alive>
    <router-view v-slot="{ Component }" :key="route.path">
      <!-- 直接渲染动态组件，无需 transition -->
      <component :is="Component" :key="route.path" />
    </router-view>
    <keep-alive>
      <Footer />
    </keep-alive>
  </div>
</template>

<style scoped>
/* 已不需要的动画样式，可移除 */
</style>
