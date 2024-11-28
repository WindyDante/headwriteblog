<template>
  <div id="footer">
    <!-- -->
    <div>你好 hello world 世界</div>
    <div>!!</div>
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
#footer {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  padding-bottom: 1%;
}
</style>
