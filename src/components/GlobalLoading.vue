<template>
  <div v-if="loadingState.isLoading" class="loading-overlay">
    <div class="loading-content">
      <div class="spinner"></div>
      <p>{{ loadingState.message }}</p>
    </div>
  </div>
</template>

<script>
import { loadingState } from "@/stores/loading";

export default {
  setup() {
    return { loadingState };
  },
};
</script>

<style>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
