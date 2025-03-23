<template>
  <footer class="spaceship-dashboard">
    <div class="dashboard-controls">
      <button class="control-btn focus-mode">
        <span class="control-icon">🧠</span>
        <span class="control-label">脑波阅读模式</span>
      </button>
      <button class="control-btn voice-nav">
        <span class="control-icon">🔊</span>
        <span class="control-label">声控导航</span>
      </button>
      <button class="control-btn ar-preview">
        <span class="control-icon">👁️</span>
        <span class="control-label">AR预览</span>
      </button>
    </div>
    <div class="visitor-location">
      <span class="location-label">当前坐标:</span>
      <span class="constellation-location">天龙座 RA 16h 42m</span>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'SpaceshipDashboard'
};
</script>

<style>
/* 多维度内容入口 */
.spaceship-dashboard {
  background: rgba(20, 20, 50, 0.8);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(100, 100, 255, 0.2);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-controls {
  display: flex;
  gap: 1.5rem;
}

.control-btn {
  background: rgba(30, 30, 70, 0.8);
  border: 1px solid rgba(100, 100, 255, 0.3);
  border-radius: 8px;
  padding: 0.7rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.9);
}

.control-btn:hover {
  background: rgba(50, 50, 100, 0.8);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.control-icon {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.95);
}

.visitor-location {
  background: rgba(30, 30, 70, 0.8);
  border: 1px solid rgba(100, 100, 255, 0.3);
  border-radius: 8px;
  padding: 0.7rem 1rem;
  font-size: 0.9rem;
}

.location-label {
  margin-right: 0.5rem;
  color: rgba(220, 220, 255, 0.9);
}

.constellation-location {
  font-weight: bold;
  color: rgba(230, 230, 255, 1);
  text-shadow: 0 0 5px rgba(150, 150, 255, 0.5);
}
</style>