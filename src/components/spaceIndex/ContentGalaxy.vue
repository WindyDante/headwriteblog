<template>
  <section class="content-galaxy">
    <div class="galaxy-background"></div>
    <div class="article-container">
      <article v-for="(article, index) in articles" :key="index" 
               class="article-pod"
               @mouseover="article.flipped = true" 
               @mouseleave="article.flipped = false">
        <div class="article-card" :class="{ flipped: article.flipped }">
          <div class="card-front">
            <h2 class="hologram-title">{{ article.title }}</h2>
            <div class="article-image" :style="{ backgroundImage: `url(${article.image})` }"></div>
          </div>
          <div class="card-back">
            <p class="article-summary">{{ article.summary }}</p>
            <div class="article-actions">
              <button class="action-btn" @click="$router.push({ name: 'blog-content', params: { id: 1 } })">阅读</button>
              <button class="action-btn">收藏</button>
              <button class="action-btn">分享</button>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ContentGalaxy',
  props: {
    articles: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style>
/* 沉浸式内容展示区 */
.content-galaxy {
  position: relative;
  padding: 4rem 2rem;
  overflow: hidden;
  z-index: 1; /* 确保内容区域在导航下拉菜单之下 */
}

.galaxy-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('/placeholder.svg?height=800&width=1200') center/cover no-repeat;
  opacity: 0.2;
  animation: rotateGalaxy 120s linear infinite;
  z-index: -1;
}

@keyframes rotateGalaxy {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.article-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  perspective: 1000px;
}

.article-pod {
  width: 300px;
  height: 350px;
  perspective: 1000px;
}

.article-card {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(100, 100, 255, 0.3);
}

.article-card.flipped {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 15px;
  overflow: hidden;
}

.card-front {
  background: rgba(30, 30, 70, 0.7);
  border: 1px solid rgba(100, 100, 255, 0.3);
}

.card-back {
  background: rgba(40, 40, 80, 0.9);
  transform: rotateY(180deg);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hologram-title {
  padding: 1rem;
  font-size: 1.4rem;
  text-align: center;
  background: linear-gradient(90deg, #4a4aff, #c056c0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 5px rgba(100, 100, 255, 0.5);
  position: relative;
  z-index: 1;
}

.hologram-title::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(74, 74, 255, 0.2), rgba(192, 86, 192, 0.2));
  filter: blur(8px);
  z-index: -1;
}

.article-image {
  width: 100%;
  height: 220px;
  background-size: cover;
  background-position: center;
}

.article-summary {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.article-actions {
  display: flex;
  justify-content: space-around;
}

.action-btn {
  background: rgba(100, 100, 255, 0.2);
  border: 1px solid rgba(100, 100, 255, 0.5);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(100, 100, 255, 0.4);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
</style>