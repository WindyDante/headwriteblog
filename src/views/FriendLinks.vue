<template>
  <div class="friend-links-container">
    <h2>{{ friendData.class_name }}</h2>
    <p class="description">{{ friendData.class_desc }}</p>
    <div class="link-list">
      <div
        v-for="link in friendData.link_list"
        :key="link.name"
        class="link-item"
      >
        <a :href="link.url" target="_blank" class="link">
          <div class="link-info">
            <div v-if="!link.avatar" class="avatar-placeholder">
              {{ getInitials(link.name) }}
            </div>
            <img v-else :src="link.avatar" alt="" class="avatar" />
            <div class="link-details">
              <span class="link-name">{{ link.name }}</span>
              <p class="link-desc" v-if="link.descr">{{ link.descr }}</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import yaml from "js-yaml";

export default {
  setup() {
    const friendData = ref({ class_name: "", class_desc: "", link_list: [] });

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
  flex: 1 1 calc(25% - 15px);
  margin-bottom: 20px;
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
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
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
}

.link-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.link-name {
  font-weight: bold;
  font-size: 1.3rem;
}

.link-desc {
  font-size: 0.9rem;
  color: #555;
}

/* 媒体查询以增强自适应效果 */
@media (max-width: 768px) {
  .link-item {
    flex: 1 1 calc(50% - 15px); /* 每行两个 */
  }
}

@media (max-width: 480px) {
  .link-item {
    flex: 1 1 100%; /* 每行一个 */
  }
}
</style>
