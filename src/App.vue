<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  overflow-x: hidden;
  color: #e0e0ff;
  background-color: #050520;
}

.app {
  min-height: 100vh;
  position: relative;
}
</style>