<template>
  <aside class="dna-timeline" :class="{ 'collapsed': isCollapsed }">
    <div class="dna-strand">
      <div v-for="(year, index) in timeline" :key="index" 
           class="dna-node"
           @click="expandTimelineNode(index)">
        <span class="year-label">{{ year.year }}</span>
        <div class="timeline-content" v-if="year.expanded">
          <div v-for="(item, idx) in year.items" :key="idx" class="timeline-item">
            {{ item }}
          </div>
        </div>
      </div>
    </div>

    <div class="toggle-button" @click="toggleCollapse">
      <div class="toggle-icon">{{ isCollapsed ? '>' : '<' }}</div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'TimelineSidebar',
  props: {
    timeline: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isCollapsed: false
    };
  },
  methods: {
    // 时间轴节点展开
    expandTimelineNode(index) {
      this.timeline.forEach((item, i) => {
        if (i === index) {
          item.expanded = !item.expanded;
        } else {
          item.expanded = false;
        }
      });
    },
    

    
    // 切换收起/展开状态
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    }
  }
};
</script>

<style>
/* 交互式时间轴侧边栏 */
.dna-timeline {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  transition: all 0.5s ease;
}

.dna-strand {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 400px;
  position: relative;
}

.dna-strand::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 100%;
  background: rgba(100, 100, 255, 0.5);
  transform: translateX(-50%);
}

.dna-node {
  position: relative;
  width: 40px;
  height: 40px;
  background: rgba(30, 30, 70, 0.8);
  border: 1px solid rgba(100, 100, 255, 0.5);
  border-radius: 50%;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
}

.dna-node:hover {
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(100, 100, 255, 0.7);
}

.year-label {
  font-weight: bold;
  font-size: 0.9rem;
}

.timeline-content {
  position: absolute;
  left: -220px;
  top: 0;
  width: 200px;
  background: rgba(30, 30, 70, 0.9);
  border: 1px solid rgba(100, 100, 255, 0.3);
  border-radius: 8px;
  padding: 1rem;
  z-index: 3;
}

.timeline-item {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  position: relative;
  padding-left: 15px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 6px;
  height: 6px;
  background: rgba(100, 100, 255, 0.7);
  border-radius: 50%;
  transform: translateY(-50%);
}



/* 收起/展开按钮 */
.toggle-button {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 40px;
  background: rgba(30, 30, 70, 0.7);
  border-radius: 0 5px 5px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid rgba(100, 100, 255, 0.3);
  border-left: none;
  transition: all 0.3s ease;
  z-index: 11;
  margin-right: 5px; /* 添加右侧间距 */
}

.toggle-button:hover {
  background: rgba(100, 100, 255, 0.4);
}

.toggle-icon {
  color: rgba(255, 255, 255, 0.8);
  font-weight: bold;
}

/* 收起状态 */
.dna-timeline.collapsed {
  right: -40px;
}

.dna-timeline.collapsed .dna-strand {
  opacity: 0;
  visibility: hidden;
}

.dna-timeline.collapsed .toggle-button {
  right: 40px;
  z-index: 999;
}
</style>