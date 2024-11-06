<template>
  <div class="container">
    <h1>勇敢面对生活</h1>
    <p>
      无论生活如何挑战我们，我们都需要勇敢面对。只有这样才能克服困难，实现自己的目标和价值。
    </p>
  </div>
  <div class="twikoo-container">
    <Twikoo />
  </div>
</template>

<script>
import { ref } from "vue";
import Twikoo from "@/components/Twikoo.vue";

export default {
  name: "EncouragementMessage",
  components: {
    Twikoo,
  },
  setup() {
    // 示例中没有具体使用到feature变量，如果需要可以在这里定义并返回
    const feature = ref();

    return {
      // 如果有需要返回的状态或者ref变量，这里添加
    };
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
  justify-content: center; /* 垂直居中 */
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  text-align: center; /* 文本居中 */
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1rem;
  margin-bottom: 20px;
}

/* 添加媒体查询以优化移动设备展示 */
@media (max-width: 600px) {
  .container {
    height: auto; /* 在移动设备上使用自动高度，以适应内容 */
  }

  h1 {
    font-size: 1.5rem; /* 减小字体大小以适应小屏幕 */
  }

  p {
    font-size: 0.875rem; /* 调整段落字体大小 */
  }
}

.twikoo-container {
  width: 100%; /* 确保 Twikoo 容器宽度与父容器一致 */
  display: flex;
  flex-direction: column;
  align-items: center; /* 居中对齐 Twikoo 组件 */
  justify-content: center; /* 垂直居中对齐 Twikoo 组件 */
}
</style>