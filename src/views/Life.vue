<template>
  <div class="container">
    <h1>勇敢面对生活</h1>
    <p>
      无论生活如何挑战我们，我们都需要勇敢面对。只有这样才能克服困难，实现自己的目标和价值。
    </p>
    <Twikoo />
  </div>
</template>

<script>
import { ref } from "vue";
import Twikoo from "@/components/Twikoo.vue";

export default {
  components: {
    Twikoo,
  },
  setup() {
    const feature = ref();

    return {};
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: "Courier New", monospace;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1rem;
  text-align: center;
}

/* 添加媒体查询以优化移动设备展示 */
@media (max-width: 600px) {
  .container {
    padding: 20px;
    height: auto; /* 移动端一般不使用 100vh，避免浏览器 UI 重叠 */
  }

  h1 {
    font-size: 1.5rem; /* 减小字体大小以适应小屏幕 */
  }

  p {
    font-size: 0.875rem; /* 同样调整段落字体 */
  }
}
</style>
