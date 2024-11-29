<template>
  <!-- TODO 鼠标移入阴影和卡片不在一个位置 -->
  <div class="friend-links-container">
    <!-- 显示好友分类名称 -->
    <h2>{{ friendData.class_name }}</h2>
    <!-- 显示好友分类描述 -->
    <p class="description">{{ friendData.class_desc }}</p>
    <!-- 好友链接列表 -->
    <div class="link-list">
      <!-- 遍历好友链接列表 -->
      <div
        v-for="link in friendData.link_list"
        :key="link.name"
        class="link-item"
      >
        <!-- 链接 -->
        <a :href="link.url" target="_blank" class="link">
          <div class="link-info">
            <!-- 如果没有头像，则显示名字的首字母 -->
            <div v-if="!link.avatar" class="avatar-placeholder">
              {{ getInitials(link.name) }}
            </div>
            <!-- 如果有头像，则显示头像 -->
            <img v-else :src="link.avatar" alt="" class="avatar" />
            <div class="link-details">
              <!-- 显示名字 -->
              <span class="link-name">{{ link.name }}</span>
              <!-- 如果有描述，则显示描述 -->
              <p class="link-desc" v-if="link.descr">{{ link.descr }}</p>
            </div>
          </div>
        </a>
      </div>
    </div>
    <!-- 友链申请 -->
    <div class="apply-friends">
      <a href="https://github.com/WindyDante/headwriteblog">友情链接申请--></a>
    </div>
    <Twikoo />
  </div>
</template>

<script>
import Twikoo from "@/components/Twikoo.vue";

import { ref, onMounted } from "vue";
import yaml from "js-yaml";

export default {
  components: { Twikoo },
  setup() {
    // 定义好友数据
    const friendData = ref({ class_name: "", class_desc: "", link_list: [] });

    // 在组件挂载时，加载YAML文件
    onMounted(async () => {
      try {
        const response = await fetch("friends.yaml");
        const text = await response.text();
        const data = yaml.load(text);
        friendData.value = data[0]; // 假设第一个项目包含相关数据
      } catch (error) {
        console.error("Error loading YAML file:", error);
      }
    });

    // 获取名字的首字母
    const getInitials = (name) => {
      return name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
    };

    return {
      friendData,
      getInitials,
    };
  },
};
</script>

<style scoped>
.apply-friends {
  margin: 1% 0;
  font-size: 28px;
  text-align: center;
}
.friend-links-container {
  max-width: 90%;
  margin: auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  text-align: center;
  color: #333;
}

.description {
  color: #777;
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.2rem;
}

.link-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.link-item {
  flex: 1 1 calc(24% - 15px); /* 每行四个 */
  margin: 10px; /* 添加外边距，增加间隔 */
  transition: transform 0.3s, box-shadow 0.3s;
}

.link-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
}

.link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #007bff;
  border: 1px solid #ddd;
  border-radius: 10px;
  transition: background 0.3s;
  padding: 15px;
  background: #f9f9f9; /* 添加背景色 */
}

.link:hover {
  background: #eaeaea;
}

.link-info {
  display: flex;
  align-items: center;
  width: 100%;
  transition: all 0.3s ease; /* 添加过渡效果 */
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px; /* 增加头像与名称之间的距离 */
  transition: opacity 0.3s ease, transform 0.3s ease; /* 添加过渡效果 */
}

.avatar-placeholder {
  width: 60px;
  height: 60px;
  background-color: #007bff;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 1.8rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  margin-right: 15px; /* 增加占位符与名称之间的距离 */
  transition: opacity 0.3s ease; /* 添加过渡效果 */
}

.link-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease; /* 添加过渡效果 */
}

.link-name {
  font-weight: bold;
  font-size: 1.3rem;
  transition: transform 0.3s ease, color 0.3s ease; /* 添加过渡效果 */
}

.link-desc {
  font-size: 0.9rem;
  color: #555;
}

/* 鼠标悬停效果 */
.link-item:hover .avatar {
  opacity: 0; /* 隐藏头像 */
  transform: translateX(-20px); /* 头像向左移动 */
}

.link-item:hover .link-name {
  transform: scale(1.1); /* 放大文字 */
  color: #ff4081; /* 文字颜色变化 */
}

/* 媒体查询以增强自适应效果 */
@media (max-width: 768px) {
  .link-item {
    flex: 1 1 100%; /* 每行一个 */
  }
}

@media (max-width: 480px) {
  .link-item {
    flex: 1 1 100%; /* 每行一个 */
  }

  .avatar {
    width: 50px; /* 调整头像大小 */
    height: 50px;
  }

  .link-name {
    font-size: 1.1rem; /* 调整文字大小 */
  }

  .link-desc {
    font-size: 0.8rem; /* 调整描述文字大小 */
  }
}
</style>
