<template>
  <aside class="author-station" :class="{ 'collapsed': isCollapsed }">
    <div class="glass-container">
      <div class="author-avatar" @click="rotateAvatar"></div>
      <h3 class="author-name">星际博主</h3>
      <div class="skill-orbs">
        <div v-for="(skill, index) in skills" :key="index" 
             class="skill-orb"
             @click="expandSkill(index)">
          {{ skill.name }}
          <div class="skill-detail" v-if="skill.expanded">
            {{ skill.description }}
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
  name: 'AuthorStation',
  props: {
    skills: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      avatarRotation: 0,
      isCollapsed: false
    };
  },
  methods: {
    // 技能详情展开
    expandSkill(index) {
      this.skills.forEach((skill, i) => {
        if (i === index) {
          skill.expanded = !skill.expanded;
        } else {
          skill.expanded = false;
        }
      });
    },
    
    // 旋转作者头像
    rotateAvatar() {
      this.avatarRotation += 360;
      const avatar = document.querySelector('.author-avatar');
      if (avatar) {
        avatar.style.transform = `rotateY(${this.avatarRotation}deg)`;
      }
    },
    
    // 切换收起/展开状态
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    }
  }
};
</script>

<style>
/* 全息作者空间站 */
.author-station {
  position: fixed;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  transition: all 0.5s ease;
}

.glass-container {
  background: rgba(30, 30, 70, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 100, 255, 0.3);
  border-radius: 15px;
  padding: 1.5rem;
  width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.author-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: url('/placeholder.svg?height=100&width=100') center/cover;
  margin-bottom: 1rem;
  border: 2px solid rgba(100, 100, 255, 0.5);
  transition: transform 1s ease;
  cursor: pointer;
}

.author-name {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #4a4aff, #c056c0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.skill-orbs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.skill-orb {
  background: rgba(100, 100, 255, 0.2);
  border: 1px solid rgba(100, 100, 255, 0.5);
  border-radius: 20px;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.skill-orb:hover {
  background: rgba(100, 100, 255, 0.4);
  transform: scale(1.05);
}

.skill-detail {
  position: absolute;
  top: 100%;
  left: 0;
  width: 200px;
  background: rgba(30, 30, 70, 0.9);
  border: 1px solid rgba(100, 100, 255, 0.3);
  border-radius: 8px;
  padding: 0.8rem;
  margin-top: 0.5rem;
  z-index: 5;
  font-size: 0.8rem;
  line-height: 1.4;
}

/* 收起/展开按钮样式 */
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
}

.toggle-button:hover {
  background: rgba(100, 100, 255, 0.4);
}

.toggle-icon {
  color: rgba(255, 255, 255, 0.8);
  font-weight: bold;
}

/* 收起状态样式 */
.author-station.collapsed {
  left: -200px;
}

.author-station.collapsed .toggle-button {
  right: -20px;
}
</style>