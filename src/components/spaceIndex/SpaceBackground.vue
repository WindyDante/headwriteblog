<template>
  <div class="space-background">
    <canvas ref="starsCanvas" class="stars-canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'SpaceBackground',
  data() {
    return {
      animationFrame: null
    };
  },
  mounted() {
    this.initStarBackground();
  },
  beforeUnmount() {
    cancelAnimationFrame(this.animationFrame);
  },
  methods: {
    // 星空背景初始化
    initStarBackground() {
      const canvas = this.$refs.starsCanvas;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const stars = [];
      const starCount = 200;
      
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5,
          vx: Math.random() * 0.2 - 0.1,
          vy: Math.random() * 0.2 - 0.1
        });
      }
      
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        
        stars.forEach(star => {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fill();
          
          star.x += star.vx;
          star.y += star.vy;
          
          if (star.x < 0 || star.x > canvas.width) star.vx = -star.vx;
          if (star.y < 0 || star.y > canvas.height) star.vy = -star.vy;
        });
        
        this.animationFrame = requestAnimationFrame(animate);
      };
      
      animate();
      
      window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
    }
  }
};
</script>

<style>
/* 星空背景 */
.space-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(135deg, #050520 0%, #1a1a4a 100%);
}

.stars-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>