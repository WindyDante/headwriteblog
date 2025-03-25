<template>
  <div class="space-station-container">
    <!-- Home Portal Button -->
    <button class="home-portal" @click="$router.push('/')">
      <div class="portal-icon"></div>
      <span class="portal-text"></span>
    </button>

    <!-- Particle Background -->
    <div id="particles-js" class="particles-container"></div>
    
    <!-- Floating Meteorites -->
    <div class="meteorites">
      <div class="meteorite m1"></div>
      <div class="meteorite m2"></div>
      <div class="meteorite m3"></div>
    </div>
    
    <!-- Space Station Header -->
    <div class="space-station-header">
      <div class="station-logo">
        <div class="orbit-ring"></div>
        <div class="planet"></div>
      </div>
      <h2 class="station-title">星际交流站</h2>
    </div>
    
    <!-- Twikoo Comment System -->
    <div class="hologram-container">
      <div class="hologram-effect"></div>
      <div id="tcomment" class="tcomment-space"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

// Particle animation
let particlesInstance = null;

// Custom Twikoo initialization with space theme
const initTwikoo = () => {
  // Load particles.js
  const particlesScript = document.createElement('script');
  particlesScript.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
  particlesScript.onload = () => {
    if (window.particlesJS) {
      particlesInstance = window.particlesJS('particles-js', {
        particles: {
          number: { value: 100, density: { enable: true, value_area: 800 } },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: 0.5, random: true },
          size: { value: 3, random: true },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#00FEFE",
            opacity: 0.2,
            width: 1
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" }
          },
          modes: {
            repulse: { distance: 100, duration: 0.4 },
            push: { particles_nb: 4 }
          }
        }
      });
    }
  };
  document.head.appendChild(particlesScript);
  
  // Load space icons
  const iconsLink = document.createElement('link');
  iconsLink.rel = 'stylesheet';
  iconsLink.href = 'https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css';
  document.head.appendChild(iconsLink);
  
  // Load sci-fi font
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Share+Tech+Mono&display=swap';
  document.head.appendChild(fontLink);
  
  // Load Twikoo script
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/twikoo@1.6.39/dist/twikoo.all.min.js';
  script.async = true;
  
  script.onload = () => {
    // Initialize Twikoo with minimal customization to ensure functionality
    window.twikoo.init({
      envId: 'https://twikoo.windydante.top/',
      el: '#tcomment',
      lang: 'zh-CN'
    });
    
    // Fix emoji picker visibility after Twikoo loads
    setTimeout(() => {
      // Add a global click handler for emoji buttons
      document.addEventListener('click', (e) => {
        if (e.target.closest('.tk-action-emoji')) {
          // Force the emoji picker to have the highest z-index
          setTimeout(() => {
            const emojiPicker = document.querySelector('.tk-emoji-picker');
            if (emojiPicker) {
              emojiPicker.style.zIndex = '99999';
              emojiPicker.style.position = 'absolute';
            }
          }, 100);
        }
      });
    }, 1000);
  };
  
  document.body.appendChild(script);
};

onMounted(() => {
  initTwikoo();
});

onUnmounted(() => {
  // Clean up
  if (particlesInstance && window.pJSDom && window.pJSDom.length > 0) {
    window.pJSDom[0].pJS.fn.vendors.destroypJS();
    window.pJSDom = [];
  }
});
</script>

<style>
/* Base Styles */
.space-station-container {
  position: relative;
  margin: 0 auto;
  padding: 20px;
  max-width: 900px;
  min-height: 600px;
  background-color: #0A1A2F;
  border-radius: 12px;
  overflow: visible; /* Changed from hidden to visible to allow emoji picker to show */
  font-family: 'Orbitron', sans-serif;
  color: #fff;
  box-shadow: 0 0 30px rgba(0, 254, 254, 0.3);
}

/* Home Portal Button */
.home-portal {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  padding: 5px;
  background: linear-gradient(45deg, #0A1A2F, #1E3A5F);
  border: 1px solid #00FEFE;
  border-radius: 25px;
  color: #00FEFE;
  font-family: 'Orbitron', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.home-portal:hover {
  background: linear-gradient(45deg, #1E3A5F, #0A1A2F);
  box-shadow: 0 0 15px rgba(0, 254, 254, 0.5);
  transform: translateY(-2px);
}

.portal-icon {
  width: 20px;
  height: 20px;
  border: 2px solid #00FEFE;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
}

.portal-icon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, #00FEFE 0%, transparent 70%);
  transform: translate(-50%, -50%);
  animation: portalPulse 2s ease-in-out infinite;
}

@keyframes portalPulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.8); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
}

/* Particle Background */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden; /* Contain particles within the container */
}

/* Floating Meteorites */
.meteorites {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden; /* Contain meteorites within the container */
}

.meteorite {
  position: absolute;
  background: linear-gradient(45deg, #FF5A8C, #7A88FF);
  border-radius: 50%;
  filter: blur(3px);
  opacity: 0.7;
  box-shadow: 0 0 20px rgba(255, 90, 140, 0.8);
  will-change: transform; /* Optimize animation performance */
}

.m1 {
  top: 15%;
  left: 10%;
  width: 30px;
  height: 30px;
  animation: float 15s ease-in-out infinite, glow 4s ease-in-out infinite;
}

.m2 {
  top: 60%;
  right: 15%;
  width: 20px;
  height: 20px;
  animation: float 20s ease-in-out infinite reverse, glow 6s ease-in-out infinite;
}

.m3 {
  bottom: 20%;
  left: 30%;
  width: 15px;
  height: 15px;
  animation: float 18s ease-in-out infinite, glow 5s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(20px, 30px) rotate(90deg); }
  50% { transform: translate(40px, 0) rotate(180deg); }
  75% { transform: translate(20px, -30px) rotate(270deg); }
  100% { transform: translate(0, 0) rotate(360deg); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 90, 140, 0.8); }
  50% { box-shadow: 0 0 30px rgba(0, 254, 254, 0.8); }
}

/* Space Station Header */
.space-station-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  z-index: 2;
}

.station-logo {
  position: relative;
  width: 60px;
  height: 60px;
  margin-right: 15px;
}

.orbit-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border: 2px solid #00FEFE;
  border-radius: 50%;
  animation: rotate 10s linear infinite;
  will-change: transform; /* Optimize animation performance */
}

.planet {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  background: radial-gradient(circle at 30% 30%, #7A88FF, #0A1A2F);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(0, 254, 254, 0.5);
}

@keyframes rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.station-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #00FEFE, #7A88FF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 10px rgba(0, 254, 254, 0.3);
  letter-spacing: 2px;
  margin: 0;
}

/* Hologram Container */
.hologram-container {
  position: relative;
  margin: 30px 0;
  padding: 20px;
  border-radius: 10px;
  background-color: rgba(10, 26, 47, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 254, 254, 0.3);
  box-shadow: 0 0 20px rgba(0, 254, 254, 0.2);
  z-index: 2;
  overflow: visible; /* Changed from hidden to visible to allow emoji picker to show */
}

.hologram-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 254, 254, 0.1) 0%, rgba(0, 0, 0, 0) 50%, rgba(122, 136, 255, 0.1) 100%);
  pointer-events: none;
  z-index: -1;
  overflow: hidden; /* Contain the effect within the container */
}

.hologram-effect::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: repeating-linear-gradient(
    transparent,
    transparent 2px,
    rgba(0, 254, 254, 0.05) 2px,
    rgba(0, 254, 254, 0.05) 4px
  );
  animation: scan 8s linear infinite;
  pointer-events: none;
  will-change: transform; /* Optimize animation performance */
  transform: translateZ(0); /* Force GPU acceleration */
}

@keyframes scan {
  from { transform: translateY(0); }
  to { transform: translateY(50%); }
}

/* Twikoo Space Theme */
.tcomment-space {
  position: relative;
  z-index: 3;
  font-family: 'Share Tech Mono', monospace;
}

/* Custom Twikoo Styling */
/* These styles are applied to the global scope to affect Twikoo elements */
.tk-comments {
  background-color: transparent !important;
}

.tk-comment {
  background-color: rgba(10, 26, 47, 0.8) !important;
  border: 1px solid rgba(0, 254, 254, 0.2) !important;
  border-radius: 10px !important;
  margin-bottom: 20px !important;
  padding: 15px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3) !important;
}

.tk-comment:hover {
  border-color: rgba(0, 254, 254, 0.5) !important;
  box-shadow: 0 8px 25px rgba(0, 254, 254, 0.2) !important;
}

.tk-avatar {
  position: relative !important;
  border: none !important;
  overflow: visible !important;
}

.tk-avatar img {
  border-radius: 50% !important;
  z-index: 0 !important;
}

.tk-meta {
  color: #7A88FF !important;
}

.tk-nick {
  color: #00FEFE !important;
  font-weight: 700 !important;
  text-shadow: 0 0 5px rgba(0, 254, 254, 0.5) !important;
}

.tk-time {
  font-family: 'Share Tech Mono', monospace !important;
  opacity: 0.8 !important;
}

.tk-comment-content {
  color: #fff !important;
  line-height: 1.6 !important;
  position: relative !important;
  background-color: rgba(0, 0, 0, 0.2) !important;
  padding: 15px !important;
  border-radius: 8px !important;
  margin: 10px 0 !important;
  border-left: 3px solid #00FEFE !important;
}

.tk-action {
  color: #7A88FF !important;
}

.tk-action:hover {
  color: #00FEFE !important;
}

.tk-submit {
  padding: 10px;
  background: linear-gradient(45deg, #0A1A2F, #1E3A5F) !important;
  border: 1px solid #00FEFE !important;
  color: #00FEFE !important;
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 1px !important;
  transition: all 0.3s ease !important;
  position: relative !important;
  overflow: hidden !important;
}

.tk-submit:hover {
  background: linear-gradient(45deg, #1E3A5F, #0A1A2F) !important;
  box-shadow: 0 0 15px rgba(0, 254, 254, 0.5) !important;
}

.tk-input {
  background-color: rgba(10, 26, 47, 0.8) !important;
  border: 1px solid rgba(0, 254, 254, 0.3) !important;
  color: #fff !important;
  font-family: 'Share Tech Mono', monospace !important;
}

.tk-input:focus {
  border-color: #00FEFE !important;
  box-shadow: 0 0 10px rgba(0, 254, 254, 0.3) !important;
}

.tk-footer {
  display: none !important;
}

.tk-footer a {
  color: #00FEFE !important;
}
.OwO{
  display: none !important;
}

/* Add space helmet effect to avatars */
.tk-avatar::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: 2px solid #00FEFE;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 254, 254, 0.5);
  pointer-events: none;
  z-index: 1;
}

.tk-avatar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(0, 254, 254, 0.3), transparent 70%);
  animation: breathe 4s ease-in-out infinite;
  pointer-events: none;
  z-index: 2;
  will-change: opacity; /* Optimize animation performance */
}

@keyframes breathe {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}

/* Fix for emoji picker */
.tk-emoji-picker {
  z-index: 99999 !important; /* Ensure emoji picker is above all other elements */
  background-color: #0A1A2F !important; /* Match space theme */
  border: 1px solid #00FEFE !important;
  box-shadow: 0 0 20px rgba(0, 254, 254, 0.5) !important;
  position: absolute !important;
}

.tk-emoji-picker .tk-emoji-tabs {
  background-color: #0A1A2F !important;
  border-bottom: 1px solid #00FEFE !important;
}

.tk-emoji-picker .tk-emoji-tab {
  color: #7A88FF !important;
}

.tk-emoji-picker .tk-emoji-tab.active {
  color: #00FEFE !important;
  border-bottom: 2px solid #00FEFE !important;
}

.tk-emoji-picker .tk-emoji {
  background-color: transparent !important;
}

.tk-emoji-picker .tk-emoji:hover {
  background-color: rgba(0, 254, 254, 0.2) !important;
}

/* Ensure emoji button is visible and working */
.tk-action-emoji {
  position: relative !important;
  z-index: 10 !important;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .space-station-container {
    padding: 15px;
  }
  
  .station-title {
    font-size: 1.8rem;
  }
  
  .tk-comment {
    padding: 10px !important;
  }
}

@media (max-width: 480px) {
  .station-title {
    font-size: 1.5rem;
  }
}

/* Fix for scrollbar issue */
html, body {
  overflow-x: hidden;
}

body {
  position: relative;
  height: auto;
}
</style>