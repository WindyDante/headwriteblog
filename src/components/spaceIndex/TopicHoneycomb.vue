<template>
  <section class="honeycomb-grid">
    <div v-for="(topic, index) in topics" :key="index" 
         class="hexagon-cell"
         :style="{ 
           backgroundColor: topic.color, 
           transform: `scale(${0.8 + (topic.popularity * 0.4)})` 
         }">
      <h3>{{ topic.name }}</h3>
      <span class="topic-count">{{ topic.count }}</span>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TopicHoneycomb',
  props: {
    topics: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style>
/* 智能内容矩阵 */
.honeycomb-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.hexagon-cell {
  width: 150px;
  height: 170px;
  margin: 15px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  transition: all 0.3s ease;
  cursor: pointer;
}

.hexagon-cell:hover {
  transform: translateY(-10px) scale(1.05) !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.hexagon-cell h3 {
  font-size: 1rem;
  text-align: center;
  margin-bottom: 0.5rem;
}

.topic-count {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>