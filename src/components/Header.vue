<template>
  <div id="header">
    <div class="title">
      <div class="titleLeft">博客名称 and logo</div>
      <div class="titleCenter">
        <div @click="toHome">首页</div>
        <div @click="toLife">生活</div>
        <div @click="toMessageBoard">留言板</div>
        <div @click="toFriendLinks">友链</div>
      </div>
      <div class="titleRight">其他功能or工具</div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    const toHome = () => {
      router.push({ name: "main" });
    };

    const toLife = () => {
      router.push({ name: "life" });
    };

    const toMessageBoard = () => {
      router.push({ name: "messageBoard" });
    };

    const toFriendLinks = () => {
      router.push({ name: "friends" });
    };

    return { toHome, toLife, toMessageBoard, toFriendLinks };
  },
};
</script>

<style scoped>
#header {
  width: 100%;
  background: gray;
  transition: background 0.3s ease;
}

.title {
  font-size: 1.5rem; /* 使用相对单位 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  height: 60px; /* 提高高度以便更好显示 */
}

.titleCenter {
  display: flex;
  flex-grow: 1; /* 使中心部分自适应宽度 */
  align-items: center;
  justify-content: space-around;
}

.titleCenter div {
  cursor: pointer;
  transition: color 0.3s, transform 0.3s;
}

.titleCenter div:hover {
  color: #007bff; /* 悬停时改变颜色 */
  transform: scale(1.1); /* 悬停时放大 */
}

.titleLeft,
.titleRight {
  color: white; /* 左右部分的文字颜色 */
  white-space: nowrap; /* 防止换行 */
}

/* 媒体查询以增强自适应效果 */
@media (max-width: 768px) {
  .title {
    font-size: 1.2rem; /* 在小屏幕上减小字体 */
  }
}

@media (max-width: 480px) {
  .title {
    flex-direction: column; /* 在超小屏幕上纵向排列 */
    height: auto; /* 自动高度 */
  }
  .titleCenter {
    justify-content: center; /* 中心部分居中对齐 */
  }
}
</style>
