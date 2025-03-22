<template>
  <section class="recommendation-starmap">
    <h2>探索更多知识宇宙</h2>
    <div class="starmap-container" ref="starmapContainer">
      <div v-for="(cluster, index) in recommendationClusters" :key="index" class="star-cluster">
        <h3 class="cluster-name">{{ cluster.name }}</h3>
        <div v-for="(article, idx) in cluster.articles" :key="idx" 
             class="star-article"
             @mousedown="startDragStar(cluster, article, $event)"
             @click.stop="previewArticle(article)"
             :style="{ 
               left: `${article.position.x}%`, 
               top: `${article.position.y}%`,
               transform: `scale(${article.scale})`,
               cursor: article.isDragging ? 'grabbing' : 'grab'
             }">
          <div class="star-glow"></div>
          <span class="star-title">{{ article.title }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'RecommendationStarmap',
  props: {
    recommendationClusters: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    // 拖动星图监听
    if (this.$refs.starmapContainer) {
      this.initDraggableStarmap();
    }
  },
  methods: {
    // 文章预览
    previewArticle(article) {
      // 如果正在拖动，不触发预览
      if (article.isDragging) return;
      
      alert(`预览文章: ${article.title}`);
      // 这里可以实现文章预览弹窗
    },
    
    // 开始拖动星星
    startDragStar(cluster, article, event) {
      // 阻止事件冒泡，避免触发星图容器的拖动
      event.stopPropagation();
      
      // 设置当前星星为拖动状态
      article.isDragging = true;
      
      // 记录初始鼠标位置和星星位置
      const startX = event.clientX;
      const startY = event.clientY;
      const startPosX = article.position.x;
      const startPosY = article.position.y;
      
      // 获取星系元素，用于限制拖动范围
      const clusterElement = event.target.closest('.star-cluster');
      const clusterRect = clusterElement.getBoundingClientRect();
      
      // 鼠标移动事件处理函数
      const handleMouseMove = (moveEvent) => {
        if (article.isDragging) {
          // 计算鼠标移动的距离
          const deltaX = moveEvent.clientX - startX;
          const deltaY = moveEvent.clientY - startY;
          
          // 计算新位置（百分比）
          let newX = startPosX + (deltaX / clusterRect.width) * 100;
          let newY = startPosY + (deltaY / clusterRect.height) * 100;
          
          // 限制在星系范围内（10%-90%）
          newX = Math.max(10, Math.min(90, newX));
          newY = Math.max(10, Math.min(90, newY));
          
          // 更新星星位置
          article.position.x = newX;
          article.position.y = newY;
        }
      };
      
      // 鼠标释放事件处理函数
      const handleMouseUp = () => {
        article.isDragging = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      // 添加全局事件监听
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    
    // 初始化可拖动星图
    initDraggableStarmap() {
      let isDragging = false;
      let startX, startY, scrollLeft, scrollTop;
      
      const container = this.$refs.starmapContainer;
      
      container.addEventListener('mousedown', (e) => {
        // 检查是否点击在星星上，如果是则不启动星图拖动
        if (e.target.closest('.star-article')) {
          return;
        }
        
        isDragging = true;
        startX = e.pageX - container.offsetLeft;
        startY = e.pageY - container.offsetTop;
        scrollLeft = container.scrollLeft;
        scrollTop = container.scrollTop;
      });
      
      container.addEventListener('mouseleave', () => {
        isDragging = false;
      });
      
      container.addEventListener('mouseup', () => {
        isDragging = false;
      });
      
      container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const y = e.pageY - container.offsetTop;
        const walkX = (x - startX) * 2;
        const walkY = (y - startY) * 2;
        container.scrollLeft = scrollLeft - walkX;
        container.scrollTop = scrollTop - walkY;
      });
    }
  }
};
</script>

<style>
/* 智能推荐星图 */
.recommendation-starmap {
  padding: 4rem 2rem;
  text-align: center;
}

.recommendation-starmap h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  background: linear-gradient(90deg, #4a4aff, #c056c0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.starmap-container {
  position: relative;
  width: 100%;
  height: 500px;
  background: rgba(10, 10, 40, 0.5);
  border-radius: 15px;
  overflow: hidden;
  cursor: grab;
}

.starmap-container:active {
  cursor: grabbing;
}

.star-cluster {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(100, 100, 255, 0.2) 0%, transparent 70%);
}

.star-cluster:nth-child(1) {
  top: 10%;
  left: 20%;
}

.star-cluster:nth-child(2) {
  top: 30%;
  left: 60%;
}

.cluster-name {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
  color: rgba(200, 200, 255, 0.7);
}

.star-article {
  position: absolute;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

.star-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 50%;
  filter: blur(5px);
  animation: starPulse 3s ease-in-out infinite;
}

@keyframes starPulse {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.8; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
}

.star-title {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  background: rgba(30, 30, 70, 0.9);
  border: 1px solid rgba(100, 100, 255, 0.3);
  border-radius: 8px;
  padding: 0.5rem;
  font-size: 0.8rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.star-article:hover .star-title {
  opacity: 1;
}
</style>