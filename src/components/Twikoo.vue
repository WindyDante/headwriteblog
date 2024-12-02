<template>
  <div class="twikoo-container">
    <div id="tcomment"></div>
  </div>
</template>

<script>
import { onMounted } from "vue";

export default {
  name: "Twikoo",
  setup() {
    onMounted(() => {
      // 动态加载 Twikoo 脚本
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/twikoo@1.6.39/dist/twikoo.all.min.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        // 在加载完成后初始化 Twikoo
        twikoo.init({
          envId: "https://twikoo.windydante.top/", // 替换为你的环境 ID 或 Vercel 地址
          el: "#tcomment",
          lang: "zh-CN",
        });
      };
    });

    return {};
  },
};
</script>

<style scoped>
.twikoo-container {
  margin: 0 15px; /* 设置左右边距 */
  padding: 10px; /* 外层容器的内边距 */
  border-radius: 5px; /* 圆角 */
  max-width: 800px; /* 设置最大宽度以适应 PC 端 */
  margin-left: auto; /* 水平居中 */
  margin-right: auto; /* 水平居中 */
}

#tcomment {
  padding: 10px; /* Twikoo 评论区的内边距 */
}

/* 自适应样式 */
@media (max-width: 768px) {
  .twikoo-container {
    margin: 0 10px; /* 移动端时减少外边距 */
  }

  #tcomment {
    padding: 5px; /* 移动端评论区内边距 */
  }
}
</style>
