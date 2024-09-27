<script setup>
import Home from "@/views/Home.vue";
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
      <!-- 使用 <component> 标签来动态渲染组件 -->
    </transition>
  </router-view>
</template>

<style>
@import "@/assets/font/font.css";
* {
  padding: 0;
  margin: 0;
  font-family: keko;
}
body,
#app {
  /* animation: fadeInAnimation ease 3s forwards; */

  width: 100%;
  height: 100%;
}
</style>