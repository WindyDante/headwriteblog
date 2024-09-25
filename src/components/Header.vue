<template>
  <div id="header">
    <!-- -->
    <h1>Hedaer</h1>
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
#header {
  width: 100%;
  height: 50px;
  background: gray;
}
</style>
