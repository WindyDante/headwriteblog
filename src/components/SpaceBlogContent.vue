<template>
  <div class="universe" ref="universeRef">
    <!-- 返回主页按钮 -->
    <button class="home-portal" @click="$router.push('/')">
      <div class="portal-icon"></div>
      <span class="portal-text">

      </span>
    </button>

    <!-- WebGL Accelerated Background -->
    <canvas ref="starsCanvas" class="stars-canvas"></canvas>

    <!-- Random Meteor Trails -->
    <div class="meteor-container">
      <div class="meteor" v-for="i in 5" :key="`meteor-${i}`"></div>
    </div>

    <header class="holographic-header">
      <div class="particle-title">
        <!-- 3D Particle Rotation + Halo Diffusion Animation -->
        <h1 ref="titleRef" class="title-3d">星际叙事者</h1>
        <div class="title-particles"></div>
        <div class="halo-diffusion"></div>
        <div class="orbit-info">
          <span class="author">作者:宇宙探索者          </span>
          <span class="date"><span class="label">发布日期</span> <span class="number">2077-03-14</span></span>
          <span class="views"><span class="label">阅读量</span> <span class="number">3,141,592</span></span>
        </div>
      </div>
    </header>

    <main class="content-container">
      <section class="reading-area">
        <article>
          <!-- Word-by-word Highlighting -->
          <p
            class="paragraph"
            v-for="(paragraph, index) in paragraphs"
            :key="`p-${index}`"
            ref="paragraphRefs"
          >
            <span
              v-for="(word, wordIndex) in splitIntoParts(paragraph)"
              :key="`word-${index}-${wordIndex}`"
              class="word-highlight"
              :class="{ 'highlight-active': isWordActive(index, wordIndex) }"
              @mouseover="activateWord(index, wordIndex)"
              >{{ word }}</span
            >


          </p>



        </article>
      </section>

      <aside class="annotation-panel">
        

        <!-- Emotion Visualization with Wave-driven Particles -->
        <div class="emotion-spectrum">
          <h3>情绪光谱仪</h3>
          <div class="emotion-wave">
            <div
              class="wave-point"
              v-for="(point, index) in emotionPoints"
              :key="`emotion-${index}`"
              :style="{
                height: point.value + 'px',
                backgroundColor: point.color,
              }"
              @mouseover="activateEmotionPoint(index)"
            >
              <div class="wave-particles"></div>
            </div>
          </div>
          <div class="emotion-label" v-if="activeEmotionPoint !== null">
            {{ emotionLabels[activeEmotionPoint] }}
          </div>
        </div>

        <!-- Knowledge Network with Physics Effects -->
        <div
          class="knowledge-network"
          v-if="showKnowledgeNode"
          ref="knowledgeNetworkRef"
        >
          <h3>延伸阅读</h3>
          <div
            class="related-crystal"
            v-for="(item, index) in relatedArticles"
            :key="`crystal-${index}`"
            :style="{ backgroundColor: item.color }"
            @click="navigateToArticle(item.id)"
            ref="crystalRefs"
          >
            {{ item.title }}
            <div class="crystal-glow"></div>
          </div>
        </div>

        <!-- Real-time Star Map -->
        <div class="star-map">
          <h3>阅读星图</h3>
          <div class="map-container" ref="starMapRef">
            <div
              class="current-position"
              :style="{ left: `${readingProgress * 100}%` }"
            ></div>
            <div
              class="map-node"
              v-for="(node, index) in starMapNodes"
              :key="`node-${index}`"
              :style="{ left: `${node.position * 100}%` }"
              :class="{ 'node-active': readingProgress >= node.position }"
            >
              <div class="node-tooltip">{{ node.title }}</div>
            </div>
          </div>
        </div>
      </aside>
    </main>

    <footer class="dimension-footer">
      <div class="reference-forest">
        <h3>知识雨林</h3>
        <div class="reference-trees">
          <div
            class="tree"
            v-for="(ref, index) in references"
            :key="`tree-${index}`"
            :style="{ height: ref.citations * 10 + 'px' }"
            @click="showReference(index)"
          >
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

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from "vue";
import * as THREE from "three";

// State variables
const universeRef = ref(null);
const titleRef = ref(null);
const starsCanvas = ref(null);
const paragraphRefs = ref([]);
const gravityPointRef = ref(null);
const knowledgeNetworkRef = ref(null);
const crystalRefs = ref([]);
const starMapRef = ref(null);


const activeParagraph = ref(0);
const activeWord = ref({ paragraphIndex: null, wordIndex: null });

const selectedReference = ref(null);
const activeEmotionPoint = ref(0);
const readingProgress = ref(0);

// Content data
const paragraphs = ref([
  "在宇宙的边缘，量子计算正在重塑我们对信息处理的理解。这种基于量子力学原理的计算方式，利用量子比特的叠加态和纠缠效应，能够在特定问题上实现指数级的性能提升。",
  "量子计算机不再是理论构想，而是逐渐成为现实。科学家们已经成功构建了包含数十个量子比特的原型系统，并在量子模拟、密码学和优化问题上展示了其潜力。",
  "然而，量子计算面临的挑战依然巨大。量子退相干问题要求系统在极低温度下运行，量子纠错技术仍在发展中，可扩展性问题亟待解决。",
  "尽管如此，量子计算的未来令人期待。随着技术的进步，我们可能会看到量子计算在药物发现、材料科学、金融建模和人工智能等领域带来革命性突破。",
  "在这个星际时代，量子计算将成为人类探索宇宙奥秘的关键工具，帮助我们解决传统计算无法应对的复杂问题，开启科技发展的新篇章。",
]);



const emotionPoints = ref([
  { value: 30, color: "#4A00FF" }, // 平静
  { value: 60, color: "#7A5FFF" }, // 好奇
  { value: 80, color: "#00FEFE" }, // 惊奇
  { value: 40, color: "#00D6D6" }, // 担忧
  { value: 70, color: "#5CFFFF" }, // 希望
]);

const emotionLabels = ["平静", "好奇", "惊奇", "担忧", "希望"];

const relatedArticles = ref([
  { id: 1, title: "量子纠缠的未解之谜", color: "#4A00FF" },
  { id: 2, title: "量子计算机的工程挑战", color: "#00FEFE" },
  { id: 3, title: "后量子密码学前沿", color: "#7A5FFF" },
]);

const references = ref([
  { title: "量子计算导论", author: "Nielsen & Chuang", citations: 12 },
  { title: "量子信息理论", author: "Wilde", citations: 8 },
  { title: "量子算法综述", author: "Montanaro", citations: 5 },
  { title: "量子硬件实现", author: "Ladd et al.", citations: 7 },
]);

const starMapNodes = [
  { position: 0.1, title: "量子计算基础" },
  { position: 0.3, title: "量子计算机现状" },
  { position: 0.5, title: "技术挑战" },
  { position: 0.7, title: "未来展望" },
  { position: 0.9, title: "星际应用" },
];

// Helper functions
const splitIntoParts = (text) => {
  // Split text into words with punctuation attached
  return (
    text.match(/[\u4e00-\u9fa5]+|[a-zA-Z0-9]+|[^\s\u4e00-\u9fa5a-zA-Z0-9]+/g) ||
    []
  );
};

const isWordActive = (paragraphIndex, wordIndex) => {
  return (
    activeWord.value.paragraphIndex === paragraphIndex &&
    activeWord.value.wordIndex === wordIndex
  );
};

const activateWord = (paragraphIndex, wordIndex) => {
  activeWord.value = { paragraphIndex, wordIndex };
};



const activateEmotionPoint = (index) => {
  activeEmotionPoint.value = index;

  // Trigger particle effect based on emotion
  if (universeRef.value) {
    const emotionIntensity = emotionPoints.value[index].value / 100;
    updateParticlesBehavior(emotionIntensity);
  }
};

// Main functions








const navigateToArticle = (id) => {
  console.log("导航到文章ID:", id);
  // 在实际应用中，这里会添加导航到相关文章的逻辑
};

const showReference = (index) => {
  // 切换选中状态
  selectedReference.value = selectedReference.value === index ? null : index;
};

// WebGL and Animation Functions
let renderer, scene, camera, stars, meteors;
let particleSystem, titleParticles;
let physicsWorld,
  crystalBodies = [];
let animationFrameId;

const initWebGLStarfield = () => {
  if (!starsCanvas.value) return;

  // Initialize Three.js scene
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({
    canvas: starsCanvas.value,
    alpha: true,
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Create stars
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
  });

  const starsVertices = [];
  for (let i = 0; i < 5000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starsVertices.push(x, y, z);
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starsVertices, 3)
  );
  stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);



  // Position camera
  camera.position.z = 500;

  // Start animation loop
  animateStarfield();
};

const animateStarfield = () => {
  animationFrameId = requestAnimationFrame(animateStarfield);

  // Rotate stars slowly
  stars.rotation.y += 0.0003;
  stars.rotation.x += 0.0001;

  // Update meteors
  updateMeteors();

  // Render scene
  renderer.render(scene, camera);
};



const createMeteors = () => {
  const meteorElements = document.querySelectorAll(".meteor");

  meteorElements.forEach((meteor, index) => {
    setTimeout(() => {
      launchMeteor(meteor);
    }, index * 3000 + Math.random() * 5000);
  });
};

const launchMeteor = (meteorElement) => {
  // Reset meteor position
  const startX = Math.random() * 100;
  const startY = -5;
  const endX = startX - 20 - Math.random() * 30;
  const endY = 105;

  meteorElement.style.left = `${startX}%`;
  meteorElement.style.top = `${startY}%`;
  meteorElement.style.opacity = "1";
  meteorElement.style.setProperty("--end-x", `${endX}%`);
  meteorElement.style.setProperty("--end-y", `${endY}%`);

  // Trigger animation
  meteorElement.classList.add("meteor-active");

  // Reset after animation completes
  setTimeout(() => {
    meteorElement.classList.remove("meteor-active");
    meteorElement.style.opacity = "0";

    // Schedule next meteor
    setTimeout(() => {
      launchMeteor(meteorElement);
    }, Math.random() * 15000 + 5000);
  }, 3000);
};

const updateMeteors = () => {
  // This function would update Three.js meteor particles if implemented
};

const init3DTitleEffect = () => {
  if (!titleRef.value) return;

  // Create title particles
  const titleRect = titleRef.value.getBoundingClientRect();
  const titleParticlesContainer = document.querySelector(".title-particles");

  if (!titleParticlesContainer) return;

  // Clear existing particles
  titleParticlesContainer.innerHTML = "";

  // Create new particles
  for (let i = 0; i < 100; i++) {
    const particle = document.createElement("div");
    particle.className = "title-particle";

    // Random position around title
    const x = Math.random() * titleRect.width;
    const y = Math.random() * titleRect.height;
    const z = Math.random() * 50 - 25;

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.transform = `translateZ(${z}px)`;

    // Random size and color
    const size = Math.random() * 4 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Use theme colors
    const colors = ["#4A00FF", "#7A5FFF", "#00FEFE", "#5CFFFF"];
    particle.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    // Add to container
    titleParticlesContainer.appendChild(particle);

    // Animate particle
    animateTitleParticle(particle);
  }

  // Create halo diffusion effect
  const halo = document.querySelector(".halo-diffusion");
  if (halo) {
    setInterval(() => {
      halo.classList.add("pulse");
      setTimeout(() => {
        halo.classList.remove("pulse");
      }, 2000);
    }, 4000);
  }
};

const animateTitleParticle = (particle) => {
  // Random movement
  const duration = Math.random() * 10 + 5;
  const xMove = Math.random() * 40 - 20;
  const yMove = Math.random() * 40 - 20;
  const zMove = Math.random() * 60 - 30;

  particle.style.transition = `transform ${duration}s ease-in-out, opacity ${duration}s ease-in-out`;

  setTimeout(() => {
    const currentTransform = getComputedStyle(particle).transform;
    particle.style.transform = `${currentTransform} translate3d(${xMove}px, ${yMove}px, ${zMove}px)`;

    // Reset after animation
    setTimeout(() => {
      particle.style.transition = "none";
      particle.style.transform = "translateZ(0)";

      // Restart animation
      setTimeout(() => {
        animateTitleParticle(particle);
      }, 100);
    }, duration * 1000);
  }, 100);
};

const initPhysicsForCrystals = () => {
  if (!crystalRefs.value || crystalRefs.value.length === 0) return;

  // In a real implementation, this would initialize a physics engine
  // For this demo, we'll use simple CSS animations

  crystalRefs.value.forEach((crystal, index) => {
    if (!crystal) return;

    // Add physics-based animation classes
    crystal.classList.add("physics-enabled");

    // Set random initial velocity
    const vx = Math.random() * 10 - 5;
    const vy = Math.random() * 10 - 5;

    crystal.style.setProperty("--vx", `${vx}`);
    crystal.style.setProperty("--vy", `${vy}`);

    // Add collision detection
    crystal.addEventListener("animationiteration", () => {
      // Simulate collision by changing velocity
      const newVx = Math.random() * 10 - 5;
      const newVy = Math.random() * 10 - 5;

      crystal.style.setProperty("--vx", `${newVx}`);
      crystal.style.setProperty("--vy", `${newVy}`);
    });
  });
};

const updateParticlesBehavior = (intensity) => {
  // This would update the particle behavior based on emotion intensity
  document.documentElement.style.setProperty("--emotion-intensity", intensity);
};

const initEnergyTowerEffects = () => {
  const towers = document.querySelectorAll(".energy-tower");

  towers.forEach((tower, index) => {
    // Set tower index for staggered animations
    tower.style.setProperty("--tower-index", index);

    // Create flow effect
    const flow = tower.querySelector(".tower-flow");
    if (flow) {
      flow.style.animationDelay = `${index * 0.2}s`;
    }
  });
};

// Scroll handling with RAF for performance
const handleScroll = () => {
  // Calculate reading progress
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  readingProgress.value = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);

  // Find active paragraph
  if (paragraphRefs.value && paragraphRefs.value.length) {
    const viewportCenter = window.innerHeight / 2;

    let closestParagraph = 0;
    let minDistance = Infinity;

    paragraphRefs.value.forEach((paragraph, index) => {
      if (!paragraph) return;

      const rect = paragraph.getBoundingClientRect();
      const paragraphCenter = rect.top + rect.height / 2;
      const distance = Math.abs(paragraphCenter - viewportCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestParagraph = index;
      }
    });

    // Only update if changed
    if (activeParagraph.value !== closestParagraph) {
      activeParagraph.value = closestParagraph;
    }
  }
};

// Throttled scroll handler using requestAnimationFrame
let ticking = false;
const scrollHandler = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
};

// Lifecycle hooks
onMounted(() => {
  // Initialize WebGL starfield
  initWebGLStarfield();

  // Initialize 3D title effect
  init3DTitleEffect();

  // Create meteor effects
  createMeteors();



  // Add scroll event listener
  window.addEventListener("scroll", scrollHandler, { passive: true });

  // Initial scroll position
  handleScroll();

  // Handle window resize
  window.addEventListener("resize", () => {
    if (renderer && camera) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Reinitialize title effect on resize
    init3DTitleEffect();
  });
});

onBeforeUnmount(() => {
  // Clean up event listeners
  window.removeEventListener("scroll", scrollHandler);

  // Stop animation loop
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  // Dispose Three.js resources
  if (renderer) {
    renderer.dispose();
  }
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap");

/* Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Helvetica Neue", Arial, sans-serif;
  line-height: 1.6;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

/* Universe Background */
.universe {
  min-height: 100vh;
  background-color: #0a0a2a;
  background-image: linear-gradient(to bottom, #0a0a2a 0%, #1a1a4a 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
  transition: background-color 0.8s ease-in-out,
    background-image 0.8s ease-in-out;
  padding: 2rem 0;
  will-change: background-color, background-image;
}



/* WebGL Canvas */
.stars-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

/* Meteor Effects */
.meteor-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.meteor {
  position: absolute;
  width: 300px;
  height: 1px;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  opacity: 0;
  transform: rotate(-45deg);
  transform-origin: right top;
  pointer-events: none;
  z-index: 2;
}

.meteor-active {
  animation: meteor 3s linear forwards;
}

@keyframes meteor {
  0% {
    opacity: 0;
    transform: rotate(-45deg) translateX(0);
  }
  10% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(-45deg) translateX(-200%);
    left: var(--end-x);
    top: var(--end-y);
  }
}

/* 3D Title Effects */
.holographic-header {
  perspective: 1000px;
  text-align: center;
  padding: 3rem 1rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
}

.particle-title {
  position: relative;
  display: inline-block;
}

.title-3d {
  font-family: "Orbitron", sans-serif;
  font-size: 4.5rem;
  text-shadow: 0 0 20px rgba(0, 254, 254, 0.5);
  position: relative;
  transform-style: preserve-3d;
  animation: floatTitle 8s ease-in-out infinite;
  will-change: transform;
  margin-bottom: 1rem;
  letter-spacing: 4px;
  color: #fff;
  background: linear-gradient(to right, #4a00ff, #00fefe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.title-particle {
  position: absolute;
  border-radius: 50%;
  background-color: #00fefe;
  pointer-events: none;
  will-change: transform, opacity;
}

.halo-diffusion {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 150%;
  background: radial-gradient(
    ellipse at center,
    rgba(74, 0, 255, 0.3) 0%,
    rgba(0, 254, 254, 0.2) 40%,
    transparent 70%
  );
  pointer-events: none;
  z-index: -1;
  opacity: 0.7;
}

.halo-diffusion.pulse {
  animation: haloPulse 2s ease-out forwards;
}

@keyframes haloPulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

@keyframes floatTitle {
  0%,
  100% {
    transform: translateY(0) rotateX(3deg);
  }
  50% {
    transform: translateY(-8px) rotateX(-3deg);
  }
}

/* Orbit Info */
.orbit-info {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.author, .date, .views {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.label {
  font-family: fangsong, "Orbitron", sans-serif;
}

.author {
  font-family: fangsong, "Orbitron", sans-serif;
}

.number {
  font-family: "Orbitron", sans-serif;
  color: #00fefe;
  text-shadow: 0 0 5px rgba(0, 254, 254, 0.3);
}

.orbit-info span {
  position: relative;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: rgba(74, 0, 255, 0.1);
  border: 1px solid rgba(0, 254, 254, 0.2);
  transition: all 0.3s ease;
  will-change: transform;
}

.orbit-info span .label {
  font-family: fangsong, sans-serif;
}

.orbit-info span .number {
  font-family: "Orbitron", monospace;
}

.orbit-info span:hover {
  background: rgba(0, 254, 254, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 254, 254, 0.2);
}

/* Content Layout */
.content-container {
  display: flex;
  justify-content: space-between;
  max-width: 1400px;
  margin: 2rem auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
  gap: 2rem;
}

.reading-area {
  flex: 3;
  background: rgba(10, 10, 42, 0.8);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 254, 254, 0.1);
  transform: translateZ(0);
}

.annotation-panel {
  flex: 1;
  background: rgba(10, 10, 42, 0.6);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 254, 254, 0.1);
  position: sticky;
  top: 2rem;
  height: fit-content;
  max-height: 90vh;
  overflow-y: auto;
  overscroll-behavior: contain;
  transform: translateZ(0);
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 254, 254, 0.3) transparent;
}

/* Word Highlighting */
.paragraph {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  line-height: 1.8;
  letter-spacing: 0.3px;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  border-radius: 8px;
  animation: fadeIn 0.5s ease-out;
  will-change: transform, opacity;
  font-family: fangsong, "Orbitron", sans-serif;
}

.word-highlight span:not([class*="number"]) {
  font-family: fangsong, "Orbitron", sans-serif;
}

.word-highlight span[class*="number"] {
  font-family: "Orbitron", sans-serif;
}
.word-highlight {
  display: inline-block;
  padding: 0 2px;
  border-radius: 3px;
  transition: all 0.2s ease;
}

.word-highlight.highlight-active {
  background: rgba(74, 0, 255, 0.2);
  color: #00fefe;
  transform: translateY(-2px);
  text-shadow: 0 0 8px rgba(0, 254, 254, 0.5);
}



/* Knowledge Gravity Point */
.knowledge-gravity-point {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem 0;
  padding: 1rem;
  background: rgba(10, 10, 42, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(74, 0, 255, 0.3);
  width: fit-content;
  animation: softAppear 1s ease-out;
}

.knowledge-gravity-point:hover {
  background: rgba(74, 0, 255, 0.1);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(74, 0, 255, 0.2);
}

.knowledge-gravity-point span {
  font-weight: 500;
  letter-spacing: 1px;
  color: #00fefe;
  text-shadow: 0 0 10px rgba(0, 254, 254, 0.5);
}

.star-bookmark {
  width: 30px;
  height: 30px;
  background: radial-gradient(#00fefe 30%, transparent 70%);
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

.gravity-field {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200%;
  height: 200%;
  background: radial-gradient(
    ellipse at center,
    rgba(74, 0, 255, 0.2) 0%,
    rgba(0, 254, 254, 0.1) 30%,
    transparent 70%
  );
  pointer-events: none;
  z-index: -1;
  animation: gravityPulse 4s ease-in-out infinite;
}

@keyframes gravityPulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.2;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.4;
  }
}

/* Data Visualization */
.data-visualization {
  margin: 3rem 0;
  padding: 1.5rem;
  background: rgba(10, 20, 50, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(0, 254, 254, 0.2);
}

.data-visualization h3 {
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  color: #00fefe;
  text-shadow: 0 0 10px rgba(0, 254, 254, 0.5);
  font-family: "Orbitron", sans-serif;
  letter-spacing: 1px;
  text-align: center;
}

.star-cluster {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 150px;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.energy-tower {
  width: 30px;
  background: linear-gradient(to top, #4a00ff 0%, #00fefe 100%);
  margin: 0 10px;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  animation: towerRise 0.8s ease-out;
  animation-fill-mode: both;
  animation-delay: calc(0.1s * var(--tower-index, 0));
  will-change: transform;
}

.energy-tower:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 15px rgba(0, 254, 254, 0.3);
}

.tower-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to top,
    rgba(74, 0, 255, 0.3) 0%,
    transparent 100%
  );
  animation: towerGlow 4s ease-in-out infinite;
  border-radius: 4px 4px 0 0;
  opacity: 0.7;
}

.tower-flow {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to top,
    transparent 0%,
    rgba(0, 254, 254, 0.5) 50%,
    transparent 100%
  );
  animation: towerFlow 2s linear infinite;
  border-radius: 4px 4px 0 0;
  opacity: 0.5;
}

.tower-compare {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  text-align: center;
  animation: compareAppear 0.3s ease-out forwards;
}

.compare-value {
  font-size: 0.8rem;
  font-weight: bold;
  color: #00fefe;
  margin-bottom: 5px;
}

.compare-line {
  height: 20px;
  width: 2px;
  background-color: #00fefe;
  margin: 0 auto;
}

.compare-line.positive {
  background-color: #00fefe;
}

.compare-line.negative {
  background-color: #ff4a4a;
}

.data-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.quantum-btn {
  background: rgba(10, 20, 50, 0.6);
  color: #fff;
  border: 1px solid rgba(0, 254, 254, 0.3);
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  font-family: "Orbitron", sans-serif;
  font-size: 0.9rem;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 254, 254, 0.2);
}

.quantum-btn:hover {
  background: rgba(0, 254, 254, 0.2);
  box-shadow: 0 0 20px rgba(0, 254, 254, 0.4);
  transform: translateY(-2px);
}

.data-detail {
  text-align: center;
  padding: 0.5rem;
  background: rgba(0, 254, 254, 0.1);
  border-radius: 8px;
  margin-top: 1rem;
  font-weight: 500;
}

@keyframes towerRise {
  from {
    transform: scaleY(0);
    opacity: 0;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
}

@keyframes towerGlow {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes flowEffect {
  0% {
    background-position: 0 100%;
  }
  100% {
    background-position: 0 0%;
  }
}

@keyframes compareAppear {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Emotion Spectrum */
.emotion-spectrum {
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(10, 20, 50, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(0, 254, 254, 0.2);
}

.emotion-spectrum h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #00fefe;
  text-shadow: 0 0 10px rgba(0, 254, 254, 0.5);
  text-align: center;
  font-family: fangsong, "Orbitron", sans-serif;
  letter-spacing: 1px;
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
  position: relative;
  overflow: hidden;
}

.wave-point:hover {
  filter: brightness(1.2);
  transform: translateY(-5px);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

.wave-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(
      circle at 30% 40%,
      rgba(255, 255, 255, 0.3) 0%,
      transparent 10%
    ),
    radial-gradient(
      circle at 70% 60%,
      rgba(255, 255, 255, 0.3) 0%,
      transparent 10%
    );
  animation: particleFlow 3s linear infinite;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.wave-point:hover .wave-particles {
  opacity: 1;
}

.emotion-label {
  text-align: center;
  margin-top: 1rem;
  font-family: "Orbitron", sans-serif;
  color: #00fefe;
  animation: labelAppear 0.3s ease-out;
}

@keyframes particleFlow {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 0% 100%;
  }
}

@keyframes labelAppear {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Knowledge Network */
.knowledge-network {
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(10, 20, 50, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(0, 254, 254, 0.2);
  overflow: hidden;
}

.knowledge-network h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #00fefe;
  text-shadow: 0 0 10px rgba(0, 254, 254, 0.5);
  text-align: center;
  font-family: "Orbitron", sans-serif;
  letter-spacing: 1px;
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
  position: relative;
  overflow: hidden;
  will-change: transform;
}

.related-crystal:hover {
  transform: rotate(15deg) scale(1.1);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

.crystal-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.8) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.related-crystal:hover .crystal-glow {
  opacity: 0.3;
  animation: crystalGlowRotate 3s linear infinite;
}

.physics-enabled {
  animation: crystalFloat 5s ease-in-out infinite;
  animation-delay: calc(var(--tower-index, 0) * 0.5s);
}

@keyframes crystalGlowRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes crystalFloat {
  0%,
  100% {
    transform: translate(calc(var(--vx, 0) * 1px), calc(var(--vy, 0) * 1px));
  }
  50% {
    transform: translate(calc(var(--vx, 0) * -1px), calc(var(--vy, 0) * -1px));
  }
}

/* Star Map */
.star-map {
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(10, 20, 50, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(0, 254, 254, 0.2);
}

.star-map h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #00fefe;
  text-shadow: 0 0 10px rgba(0, 254, 254, 0.5);
  text-align: center;
  font-family: fangsong, "Orbitron", sans-serif;
  letter-spacing: 1px;
}

.map-container {
  height: 4px;
  background: rgba(74, 0, 255, 0.3);
  border-radius: 2px;
  position: relative;
  margin: 2rem 0;
}

.current-position {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background: #00fefe;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgba(0, 254, 254, 0.5);
  transition: left 0.3s ease;
}

.map-node {
  position: absolute;
  top: 50%;
  width: 8px;
  height: 8px;
  background: rgba(74, 0, 255, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
}

.map-node.node-active {
  background: #00fefe;
  box-shadow: 0 0 8px rgba(0, 254, 254, 0.5);
}

.node-tooltip {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10, 20, 50, 0.8);
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border: 1px solid rgba(0, 254, 254, 0.2);
}

.map-node:hover .node-tooltip {
  opacity: 1;
}

/* Footer */
.dimension-footer {
  margin-top: 3rem;
  padding: 2rem 0;
  background: rgba(10, 10, 42, 0.8);
  border-top: 1px solid rgba(0, 254, 254, 0.1);
  position: relative;
  z-index: 2;
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
  color: #00fefe;
  text-shadow: 0 0 15px rgba(0, 254, 254, 0.5);
  font-family: fangsong, "Orbitron", sans-serif;
  letter-spacing: 2px;
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
  will-change: transform;
}

.tree:hover {
  transform: translateY(-5px);
}

.tree-trunk {
  width: 10px;
  height: 40%;
  background: linear-gradient(to top, #4a00ff, #7a5fff);
  margin: 0 auto;
  border-radius: 2px;
}

.tree-canopy {
  width: 40px;
  height: 60%;
  background: linear-gradient(to top, #00fefe, #5cffff);
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
  border: 1px solid rgba(0, 254, 254, 0.2);
  border-radius: 8px;
  padding: 1rem;
  width: 200px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 10;
  margin-bottom: 10px;
  animation: infoAppear 0.3s ease-out;
}

.tree-info h4 {
  margin-bottom: 0.5rem;
  color: #00fefe;
  font-family: "Orbitron", sans-serif;
}

.tree-info p {
  margin: 0.3rem 0;
  font-size: 0.9rem;
}

@keyframes infoAppear {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Animation Keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gentlePulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

@keyframes softAppear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .content-container {
    flex-direction: column;
    padding: 0 1rem;
    margin: 1rem auto;
  }

  .reading-area,
  .annotation-panel {
    width: 100% !important;
    flex: none;
  }

  .annotation-panel {
    position: relative;
    top: 0;
    max-height: none;
  }

  .title-3d {
    font-size: 2.5rem;
  }

  .orbit-info {
    flex-direction: column;
    gap: 0.5rem;
  }

  .reference-trees {
    gap: 1rem;
  }
}

/* Performance Optimizations */
.interactive-element {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 0.2s;
}

.orbit-info span,
.term-hologram,
.energy-tower,
.wave-point,
.related-crystal,
.tree,
.quantum-btn {
  transition: transform 0.2s ease, opacity 0.2s ease;
  will-change: transform, opacity;
}

/* Custom Scrollbar */
.annotation-panel::-webkit-scrollbar {
  width: 6px;
}

.annotation-panel::-webkit-scrollbar-track {
  background: transparent;
}

.annotation-panel::-webkit-scrollbar-thumb {
  background-color: rgba(0, 254, 254, 0.3);
  border-radius: 6px;
  border: 2px solid transparent;
}

.annotation-panel::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 254, 254, 0.5);
}

/* Root Variables for Animation Control */
:root {
  --emotion-intensity: 0.5;
}


/* 返回主页按钮样式 */
.home-portal {
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  padding: 3px;
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(88, 161, 255, 0.5);
  border-radius: 20px;
  color: #58a1ff;
  font-family: 'Arial', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  backdrop-filter: blur(5px);
  box-shadow: 0 0 15px rgba(88, 161, 255, 0.3);
}

.home-portal:hover {
  background: rgba(0, 0, 0, 0.8);
  border-color: #58a1ff;
  box-shadow: 0 0 20px rgba(88, 161, 255, 0.5);
  transform: scale(1.05);
}

.portal-icon {
  width: 20px;
  height: 20px;
  border: 2px solid #58a1ff;
  border-radius: 50%;
  position: relative;
}

.portal-icon::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 8px;
  height: 8px;
  border-left: 2px solid #58a1ff;
  border-bottom: 2px solid #58a1ff;
  transform: translate(-25%, -50%) rotate(45deg);
}

.portal-text {
  font-size: 14px;
  letter-spacing: 1px;
  text-shadow: 0 0 5px rgba(88, 161, 255, 0.5);
}

.home-portal:active {
  transform: scale(0.95);
}
</style>