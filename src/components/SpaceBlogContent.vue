<template>
    <div class="universe" :class="{ 'night-mode': isDarkMode }">
      <div class="stars"></div>
      <div class="twinkling"></div>
      
      <header class="holographic-header">
        <div class="particle-title">
          <h1 ref="titleRef">星际叙事者</h1>
          <div class="orbit-info">
            <span class="author">作者: 宇宙探索者</span>
            <span class="date">发布日期: 2077-03-14</span>
            <span class="views">阅读量: 3,141,592</span>
          </div>
        </div>
      </header>
      
      <main class="content-container">
        <section class="reading-area">
          <article>
            <p class="paragraph" v-for="(paragraph, index) in paragraphs" :key="index">
              {{ paragraph }}
              <span v-if="index === 0" class="simple-term">
                量子计算
              </span>
            </p>
            
            <div class="knowledge-gravity-point" @click="toggleKnowledgeNode">
              <div class="star-bookmark"></div>
              <span>知识引力点</span>
            </div>
            
            <div class="data-visualization">
              <h3>多维数据星云</h3>
              <div class="star-cluster">
                <div class="energy-tower" v-for="(value, index) in dataValues" :key="index"
                     :style="{ height: value + 'px' }"
                     @click="showDataDetail(index)">
                  <div class="tower-glow"></div>
                </div>
              </div>
              <div class="data-detail" v-if="selectedDataPoint !== null">
                数据点 {{ selectedDataPoint + 1 }}: {{ dataValues[selectedDataPoint] }} 单位
              </div>
            </div>
          </article>
        </section>
        
        <aside class="annotation-panel">
          <div class="mode-toggle">
            <button @click="toggleDarkMode">
              {{ isDarkMode ? '日间模式' : '夜间模式' }}
            </button>
          </div>
          
          <div class="emotion-spectrum">
            <h3>情绪光谱仪</h3>
            <div class="emotion-wave">
              <div class="wave-point" v-for="(point, index) in emotionPoints" :key="index"
                   :style="{ height: point.value + 'px', backgroundColor: point.color }">
              </div>
            </div>
          </div>
          
          <div class="knowledge-network" v-if="showKnowledgeNode">
            <h3>延伸阅读</h3>
            <div class="related-crystal" v-for="(item, index) in relatedArticles" :key="index"
                 :style="{ backgroundColor: item.color }"
                 @click="navigateToArticle(item.id)">
              {{ item.title }}
            </div>
          </div>
        </aside>
      </main>
      
      <footer class="dimension-footer">
        <div class="reference-forest">
          <h3>知识雨林</h3>
          <div class="reference-trees">
            <div class="tree" v-for="(ref, index) in references" :key="index"
                 :style="{ height: (ref.citations * 10) + 'px' }"
                 @click="showReference(index)">
              <div class="tree-trunk"></div>
              <div class="tree-canopy"></div>
              <div class="tree-info" v-if="selectedReference === index">
                <h4>{{ ref.title }}</h4>
                <p>作者: {{ ref.author }}</p>
                <p>引用: {{ ref.citations }}</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  
  // 节流函数 - 限制函数调用频率
  function throttle(fn, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = new Date().getTime();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn.apply(this, args);
      }
    };
  }
  
  export default {
    name: 'StarryNarrator',
    setup() {
      const titleRef = ref(null)
      const isDarkMode = ref(false)
      const activeParagraph = ref(0)
      const showTermInfo = ref(false)
      const selectedDataPoint = ref(null)
      const showKnowledgeNode = ref(false)
      const selectedReference = ref(null)
      
      const paragraphs = ref([
        "在宇宙的边缘，量子计算正在重塑我们对信息处理的理解。这种基于量子力学原理的计算方式，利用量子比特的叠加态和纠缠效应，能够在特定问题上实现指数级的性能提升。",
        "量子计算机不再是理论构想，而是逐渐成为现实。科学家们已经成功构建了包含数十个量子比特的原型系统，并在量子模拟、密码学和优化问题上展示了其潜力。",
        "然而，量子计算面临的挑战依然巨大。量子退相干问题要求系统在极低温度下运行，量子纠错技术仍在发展中，可扩展性问题亟待解决。",
        "尽管如此，量子计算的未来令人期待。随着技术的进步，我们可能会看到量子计算在药物发现、材料科学、金融建模和人工智能等领域带来革命性突破。",
        "在这个星际时代，量子计算将成为人类探索宇宙奥秘的关键工具，帮助我们解决传统计算无法应对的复杂问题，开启科技发展的新篇章。"
      ])
      
      const dataValues = ref([60, 85, 40, 70, 90, 55])
      
      const emotionPoints = ref([
        { value: 30, color: '#4287f5' }, // 平静
        { value: 60, color: '#42f5a7' }, // 好奇
        { value: 80, color: '#f5d442' }, // 惊奇
        { value: 40, color: '#f54242' }, // 担忧
        { value: 70, color: '#a742f5' }  // 希望
      ])
      
      const relatedArticles = ref([
        { id: 1, title: '量子纠缠的未解之谜', color: '#4287f5' },
        { id: 2, title: '量子计算机的工程挑战', color: '#42f5a7' },
        { id: 3, title: '后量子密码学前沿', color: '#f5d442' }
      ])
      
      const references = ref([
        { title: '量子计算导论', author: 'Nielsen & Chuang', citations: 12 },
        { title: '量子信息理论', author: 'Wilde', citations: 8 },
        { title: '量子算法综述', author: 'Montanaro', citations: 5 },
        { title: '量子硬件实现', author: 'Ladd et al.', citations: 7 }
      ])
      
      const toggleDarkMode = () => {
        isDarkMode.value = !isDarkMode.value
      }
      
      const showDataDetail = (index) => {
        selectedDataPoint.value = index
      }
      
      const toggleKnowledgeNode = () => {
        showKnowledgeNode.value = !showKnowledgeNode.value
      }
      
      // 移除了滚动到段落的函数
      
      const navigateToArticle = (id) => {
        console.log('导航到文章ID:', id)
        // 在实际应用中，这里会添加导航到相关文章的逻辑
      }
      
      const showReference = (index) => {
        console.log('显示参考文献:', references.value[index])
        // 切换选中状态
        selectedReference.value = selectedReference.value === index ? null : index
      }
      
      // 移除了段落悬停事件处理函数
      
      // 创建一个更高效的节流函数，使用requestAnimationFrame
      function rafThrottle(fn) {
        let scheduled = false;
        return function(...args) {
          if (!scheduled) {
            scheduled = true;
            requestAnimationFrame(() => {
              fn.apply(this, args);
              scheduled = false;
            });
          }
        };
      }
      
      // 创建滚动处理函数（在setup作用域中定义，使其在组件实例中可访问）
      const handleScroll = rafThrottle(() => {
        // 检测哪个段落在视口中央
        const paragraphs = document.querySelectorAll('.paragraph');
        const viewportCenter = window.innerHeight / 2;
        
        let closestParagraph = 0;
        let minDistance = Infinity;
        
        paragraphs.forEach((paragraph, index) => {
          const rect = paragraph.getBoundingClientRect();
          const paragraphCenter = rect.top + rect.height / 2;
          const distance = Math.abs(paragraphCenter - viewportCenter);
          
          if (distance < minDistance) {
            minDistance = distance;
            closestParagraph = index;
          }
        });
        
        // 只在段落变化时更新状态，减少不必要的渲染
        if (activeParagraph.value !== closestParagraph) {
          activeParagraph.value = closestParagraph;
        }
      });
      
      onMounted(() => {
        // 在实际应用中，这里会添加标题3D效果的初始化代码
        console.log('组件已挂载，标题元素:', titleRef.value);
        
        // 添加性能监控，在开发环境下帮助识别性能问题
        if (process.env.NODE_ENV === 'development') {
          console.log('性能监控已启用');
        }
        
        // 设置能量塔的动画延迟索引
        setTimeout(() => {
          const towers = document.querySelectorAll('.energy-tower');
          towers.forEach((tower, index) => {
            tower.style.setProperty('--tower-index', index);
          });
        }, 0);
        
        // 添加滚动事件监听，使用passive: true提高滚动性能
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // 初始触发一次，确保初始状态正确
        handleScroll();
      });
      
      // 组件卸载前清理工作
      onBeforeUnmount(() => {
        // 移除滚动事件监听器，防止内存泄漏
        window.removeEventListener('scroll', handleScroll);
        
        // 清理可能的其他事件监听器或定时器
        // 这里可以添加任何其他需要在组件销毁前执行的清理代码
      });
      
      return {
        titleRef,
        isDarkMode,
        paragraphs,
        activeParagraph,
        dataValues,
        selectedDataPoint,
        emotionPoints,
        showKnowledgeNode,
        relatedArticles,
        references,
        selectedReference,
        toggleDarkMode,
        showDataDetail,
        toggleKnowledgeNode,
        navigateToArticle,
        showReference
      }
    }
  }
  </script>
  
  <style>
  /* 3D标题特效 */
.holographic-header {
  perspective: 1000px;
  text-align: center;
  padding: 3rem 1rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.particle-title h1 {
  font-family: 'Orbitron', sans-serif;
  font-size: 4.5rem;
  text-shadow: 0 0 20px rgba(64, 224, 208, 0.5);
  position: relative;
  transform-style: preserve-3d;
  animation: floatTitle 8s ease-in-out infinite;
  will-change: transform;
  margin-bottom: 1rem;
  letter-spacing: 2px;
}

@keyframes floatTitle {
  0%, 100% { transform: translateY(0) rotateX(3deg); }
  50% { transform: translateY(-8px) rotateX(-3deg); }
}

/* 减少动画帧数，提高性能 */
@media (prefers-reduced-motion: reduce) {
  .particle-title h1 {
    animation: none;
  }
}

.particle-title::after {
  content: '';
  position: absolute;
  width: 120%;
  height: 100px;
  background: radial-gradient(circle, 
    rgba(64, 224, 208, 0.3) 0%,
    transparent 70%);
  /* 移除模糊滤镜，提高性能 */
  /* filter: blur(30px); */
  /* 移除不必要的动画 */
  /* animation: hologramPulse 4s infinite; */
}

/* 轨道信息样式 */
.orbit-info {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
  font-family: 'Courier New', monospace;
  opacity: 0.8;
}

.orbit-info span {
  position: relative;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: rgba(64, 224, 208, 0.1);
  border: 1px solid rgba(64, 224, 208, 0.2);
  transition: all 0.3s ease;
}

.orbit-info span:hover {
  background: rgba(64, 224, 208, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 242, 254, 0.2);
}

/* 动态粒子背景 - 使用伪元素和transform优化 */
.stars {
  background: transparent;
  overflow: hidden;
}

.stars::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(2px 2px at 20% 30%, #fff, transparent),
    radial-gradient(3px 3px at 80% 70%, #fff, transparent);
  /* 使用transform代替background-position，更高效 */
  animation: starMove 100s linear infinite;
  will-change: transform;
}

.twinkling {
  background: transparent;
}

.twinkling::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(1px 1px at 90% 20%, #fff, transparent),
    radial-gradient(1px 1px at 10% 80%, #fff, transparent);
  opacity: 0.7;
}

@keyframes starMove {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(1000px, 500px, 0); }
}

/* 简化的术语样式 */
.simple-term {
  color: #00f2fe;
  font-weight: 500;
  padding: 0 3px;
}

/* 数据星云可视化 */
.data-visualization {
  margin: 3rem 0;
  padding: 1.5rem;
  background: rgba(10, 20, 50, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(64, 224, 208, 0.2);
}

.data-visualization h3 {
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  color: #00f2fe;
  text-shadow: 0 0 10px rgba(0, 242, 254, 0.5);
}

.star-cluster {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 150px;
  margin-bottom: 1rem;
  position: relative;
  z-index: 0; /* 修改为0，确保不会覆盖其他内容 */
}

.energy-tower {
  width: 30px;
  background: linear-gradient(to top, 
    #4facfe 0%,
    #00f2fe 100%);
  margin: 0 10px;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  animation: towerRise 0.8s ease-out;
  animation-fill-mode: both;
  animation-delay: calc(0.1s * var(--tower-index, 0));
}

.energy-tower:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 15px rgba(0, 242, 254, 0.3);
}

.tower-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, 
    rgba(79, 172, 254, 0.3) 0%,
    transparent 100%);
  animation: towerGlow 4s ease-in-out infinite;
  border-radius: 4px 4px 0 0;
  opacity: 0.7;
}

@keyframes towerRise {
  from { transform: scaleY(0); opacity: 0; }
  to { transform: scaleY(1); opacity: 1; }
}

@keyframes towerGlow {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 0.3; }
}

.data-detail {
  text-align: center;
  padding: 0.5rem;
  background: rgba(0, 242, 254, 0.1);
  border-radius: 8px;
  margin-top: 1rem;
  font-weight: 500;
}

@keyframes towerGlow {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.3; }
}

/* 情绪光谱仪 */
.emotion-spectrum {
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(10, 20, 50, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(64, 224, 208, 0.2);
}

.emotion-spectrum h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #00f2fe;
  text-shadow: 0 0 10px rgba(0, 242, 254, 0.5);
  text-align: center;
}

.emotion-wave {
  display: flex;
  height: 150px;
  align-items: flex-end;
  gap: 8px;
  justify-content: center;
}

.wave-point {
  width: 20px;
  transition: all 0.3s ease;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.wave-point:hover {
  filter: brightness(1.2);
  transform: translateY(-5px);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

/* 知识网络晶体 */
.knowledge-network {
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(10, 20, 50, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(64, 224, 208, 0.2);
  /* 防止出现滚动条 */
  overflow: hidden;
}

.knowledge-network h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #00f2fe;
  text-shadow: 0 0 10px rgba(0, 242, 254, 0.5);
  text-align: center;
}

.related-crystal {
  padding: 1rem;
  margin: 0.8rem 0;
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  transition: all 0.3s ease;
  text-align: center;
  font-weight: 500;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.related-crystal:hover {
  transform: rotate(15deg) scale(1.1);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

/* 自适应模式切换 */
.universe.night-mode {
  background: linear-gradient(
    to bottom right,
    #020024 0%,
    #090979 35%,
    #0d0d15 100%
  );
}

.night-mode .stars {
  opacity: 0.8;
}

.mode-toggle {
  margin-bottom: 2rem;
  text-align: center;
}

.mode-toggle button {
  background: rgba(10, 20, 50, 0.6);
  color: #fff;
  border: 1px solid rgba(64, 224, 208, 0.3);
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.9rem;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 242, 254, 0.2);
}

.mode-toggle button:hover {
  background: rgba(64, 224, 208, 0.2);
  box-shadow: 0 0 20px rgba(0, 242, 254, 0.4);
  transform: translateY(-2px);
}

/* 文章段落样式 */
.paragraph {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  line-height: 1.8;
  letter-spacing: 0.3px;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.1);
  /* 使用高性能属性，减少重排 */
  transition: transform 0.2s ease, opacity 0.2s ease, background-color 0.2s ease;
  padding: 0.5rem;
  border-radius: 8px;
  /* 减少初始动画时长 */
  animation: fadeIn 0.5s ease-out;
  /* 提示浏览器优化渲染 */
  will-change: transform, opacity;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 移除了交互反馈动画 */

/* 知识引力点 */
.knowledge-gravity-point {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem 0;
  padding: 1rem;
  background: rgba(10, 20, 50, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  width: fit-content;
  animation: softAppear 1s ease-out;
}

.knowledge-gravity-point:hover {
  background: rgba(255, 215, 0, 0.1);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.2);
}

.knowledge-gravity-point span {
  font-weight: 500;
  letter-spacing: 1px;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.star-bookmark {
  width: 30px;
  height: 30px;
  background: radial-gradient(#ffd700 30%, transparent 70%);
  clip-path: polygon(
    50% 0%,
    61% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    39% 35%
  );
  animation: gentlePulse 3s ease-in-out infinite;
}

@keyframes gentlePulse {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.1); opacity: 1; }
}

@keyframes softAppear {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes starPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* 响应式布局 */
/* 内容容器布局 */
.content-container {
  display: flex;
  justify-content: space-between;
  max-width: 1400px;
  margin: 2rem auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
  gap: 2rem;
}

.reading-area {
  flex: 3;
  background: rgba(10, 10, 42, 0.8);
  border-radius: 16px;
  padding: 2rem;
  /* 使用更轻量的阴影 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(64, 224, 208, 0.1);
  /* 使用硬件加速 */
  transform: translateZ(0);
}

.annotation-panel {
  flex: 1;
  background: rgba(10, 10, 42, 0.6);
  border-radius: 16px;
  padding: 1.5rem;
  /* 使用更轻量的阴影 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(64, 224, 208, 0.1);
  position: sticky;
  top: 2rem;
  height: fit-content;
  max-height: 90vh;
  overflow-y: auto;
  /* 优化滚动性能 */
  overscroll-behavior: contain;
  /* 使用硬件加速 */
  transform: translateZ(0);
  /* 美化滚动条 */
  scrollbar-width: thin;
  scrollbar-color: rgba(64, 224, 208, 0.3) transparent;
}

/* 自定义滚动条样式 */
.annotation-panel::-webkit-scrollbar {
  width: 6px;
}

.annotation-panel::-webkit-scrollbar-track {
  background: transparent;
}

.annotation-panel::-webkit-scrollbar-thumb {
  background-color: rgba(64, 224, 208, 0.3);
  border-radius: 6px;
  border: 2px solid transparent;
}

.annotation-panel::-webkit-scrollbar-thumb:hover {
  background-color: rgba(64, 224, 208, 0.5);
}

@media (max-width: 768px) {
  .content-container {
    flex-direction: column;
    padding: 0 1rem;
    margin: 1rem auto;
  }
  
  .reading-area, .annotation-panel {
    width: 100% !important;
    flex: none;
  }
  
  .annotation-panel {
    position: relative;
    top: 0;
    max-height: none;
  }
  
  .holographic-header h1 {
    font-size: 2.5rem;
  }
}

/* 页脚样式 */
.dimension-footer {
  margin-top: 3rem;
  padding: 2rem 0;
  background: rgba(10, 10, 42, 0.8);
  /* 移除高耗能的backdrop-filter */
  /* backdrop-filter: blur(10px); */
  border-top: 1px solid rgba(64, 224, 208, 0.1);
  position: relative;
  z-index: 1;
}

.reference-forest {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.reference-forest h3 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: #00f2fe;
  text-shadow: 0 0 15px rgba(0, 242, 254, 0.5);
  font-family: 'Orbitron', sans-serif;
}

.reference-trees {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 2rem;
  height: 150px;
}

.tree {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 40px;
}

.tree:hover {
  transform: translateY(-5px);
}

.tree-trunk {
  width: 10px;
  height: 40%;
  background: linear-gradient(to top, #8B4513, #A0522D);
  margin: 0 auto;
  border-radius: 2px;
}

.tree-canopy {
  width: 40px;
  height: 60%;
  background: linear-gradient(to top, #228B22, #32CD32);
  border-radius: 50% 50% 10% 10%;
  position: absolute;
  bottom: 40%;
  left: 50%;
  transform: translateX(-50%);
}

.tree-info {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10, 20, 50, 0.9);
  /* 移除高耗能的backdrop-filter */
  /* backdrop-filter: blur(10px); */
  border: 1px solid rgba(64, 224, 208, 0.2);
  border-radius: 8px;
  padding: 1rem;
  width: 200px;
  /* 减少阴影模糊半径 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 10;
  margin-bottom: 10px;
}

.tree-info h4 {
  margin-bottom: 0.5rem;
  color: #00f2fe;
}

.tree-info p {
  margin: 0.3rem 0;
  font-size: 0.9rem;
}

/* 全局动画曲线 - 限制应用范围，不再应用到所有元素 */
.interactive-element {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 0.2s;
}

/* 只对需要动画效果的元素应用过渡，而不是全局应用 */
.orbit-info span,
.interactive-term,
.energy-tower,
.wave-point,
.related-crystal,
.tree,
.mode-toggle button {
  /* 使用transform和opacity等高性能属性 */
  transition: transform 0.2s ease, opacity 0.2s ease;
  /* 使用will-change提示浏览器优化渲染 */
  will-change: transform, opacity;
}

/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  }
  
  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }
  
  /* 宇宙背景 */
  .universe {
    min-height: 100vh;
    background-color: #0a0a2a;
    background-image: linear-gradient(to bottom, #0a0a2a 0%, #1a1a4a 100%);
    color: #fff;
    position: relative;
    overflow: hidden;
    /* 增强过渡动画效果 */
    transition: background-color 0.8s ease-in-out, 
                background-image 0.8s ease-in-out, 
                color 0.5s ease-in-out, 
                box-shadow 0.5s ease-in-out;
    padding: 2rem 0;
    /* 提示浏览器优化渲染 */
    will-change: background-color, background-image;
  }
  
  .universe.night-mode {
    background-color: #050510;
    background-image: linear-gradient(to bottom, #050510 0%, #0a0a30 100%);
  }
  
  /* 为夜间模式下的元素添加过渡效果 */
  .universe * {
    transition: border-color 0.5s ease-in-out, 
                background-color 0.5s ease-in-out, 
                box-shadow 0.5s ease-in-out;
  }
  
  .stars, .twinkling {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    /* 使用transform代替background-position动画 */
    transform: translateZ(0);
    /* 提示浏览器优化渲染 */
    will-change: transform;
  }

</style>