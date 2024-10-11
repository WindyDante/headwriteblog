<template>
  <div class="container">
    <h1>勇敢面对生活</h1>
    <p>
      无论生活如何挑战我们，我们都需要勇敢面对。只有这样才能克服困难，实现自己的目标和价值。
    </p>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
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
</style>