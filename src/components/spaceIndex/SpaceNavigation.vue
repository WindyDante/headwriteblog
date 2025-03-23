<template>
  <header class="nav-container">
    <div class="constellation-nav">
      <div v-for="(item, index) in navItems" :key="index" 
           class="nav-item" 
           @mouseenter="openNavMenu(index)"
           @mouseleave="startCloseTimer(index)">
        <span class="nav-star"></span>
        <span class="nav-text">{{ item.name }}</span>
        <div class="nav-tooltip" 
             :class="{ active: activeNav === index }"
             @mouseenter="cancelCloseTimer"
             @mouseleave="closeNavMenu">
          <div v-for="(category, idx) in item.categories" :key="idx" class="category-tag">
            {{ category }}
          </div>
        </div>
      </div>
    </div>
    <div class="telescope-search">
      <input type="text" placeholder="探索宇宙..." @focus="triggerMeteor" />
      <div class="meteor" :class="{ active: meteorActive }"></div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'SpaceNavigation',
  data() {
    return {
      // 导航数据
      navItems: [
        { name: '技术', categories: ['前端', '后端', 'AI', '区块链'] },
        { name: '艺术', categories: ['设计', '音乐', '文学', '电影'] },
        { name: '生活', categories: ['旅行', '美食', '健康', '思考'] },
        { name: '项目', categories: ['开源', '案例', '实验', '教程'] }
      ],
      activeNav: null,
      closeTimer: null,
      meteorActive: false
    };
  },
  beforeUnmount() {
    // 清除所有定时器
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }
  },
  methods: {
    // 打开导航菜单
    openNavMenu(index) {
      // 清除任何现有的关闭定时器
      if (this.closeTimer) {
        clearTimeout(this.closeTimer);
        this.closeTimer = null;
      }
      
      this.activeNav = index;
    },
    
    // 开始关闭菜单的定时器
    startCloseTimer(index) {
      // 只有当前激活的导航项才设置关闭定时器
      if (this.activeNav === index) {
        this.closeTimer = setTimeout(() => {
          this.activeNav = null;
        }, 300); // 300ms延迟，给用户足够时间移动到下拉菜单
      }
    },
    
    // 取消关闭定时器（当鼠标进入下拉菜单时）
    cancelCloseTimer() {
      if (this.closeTimer) {
        clearTimeout(this.closeTimer);
        this.closeTimer = null;
      }
    },
    
    // 关闭导航菜单（当鼠标离开下拉菜单时）
    closeNavMenu() {
      this.activeNav = null;
    },
    
    // 流星搜索效果
    triggerMeteor() {
      this.meteorActive = true;
      setTimeout(() => {
        this.meteorActive = false;
      }, 1000);
    }
  }
};
</script>

<style>
/* 星际导航系统 */
.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: rgba(10, 10, 40, 0.7);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(100, 100, 255, 0.2);
  position: relative;
  z-index: 1000; /* 确保导航在最上层 */
}

.constellation-nav {
  display: flex;
  gap: 2rem;
  position: relative;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
}

.nav-star {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  margin-right: 8px;
  box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.7);
}

.nav-text {
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 1px;
}

.nav-tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  background: rgba(30, 30, 70, 0.9);
  border: 1px solid rgba(100, 100, 255, 0.3);
  border-radius: 8px;
  padding: 1rem;
  z-index: 1001; /* 确保下拉菜单在内容之上 */
  min-width: 200px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  /* 默认隐藏，通过class控制显示 */
  display: none;
}

.nav-tooltip.active {
  display: block;
}

.category-tag {
  display: inline-block;
  background: rgba(100, 100, 255, 0.2);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  margin: 0.3rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.category-tag:hover {
  background: rgba(100, 100, 255, 0.4);
  transform: scale(1.05);
}

.telescope-search {
  position: relative;
}

.telescope-search input {
  background: rgba(20, 20, 50, 0.6);
  border: 1px solid rgba(100, 100, 255, 0.3);
  border-radius: 20px;
  padding: 0.7rem 1rem 0.7rem 2.5rem;
  color: white;
  width: 250px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.telescope-search input:focus {
  width: 300px;
  box-shadow: 0 0 15px rgba(100, 100, 255, 0.5);
}

.telescope-search::before {
  content: '🔍';
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
}

.meteor {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 2px;
  height: 100px;
  background: linear-gradient(to bottom, transparent, white);
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.1s ease;
}

.meteor.active {
  animation: meteorFall 1s ease-out forwards;
}

@keyframes meteorFall {
  0% {
    top: -100px;
    right: -100px;
    opacity: 1;
  }
  100% {
    top: 100px;
    right: 100px;
    opacity: 0;
  }
}
</style>