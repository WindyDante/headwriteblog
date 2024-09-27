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
  height: 50px;
  background: gray;
  transition: background 0.3s ease;
}

.title {
  font-size: 23px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px;
  height: 100%;
}

.titleCenter {
  display: flex;
  width: 30%;
  align-items: center;
  justify-content: space-around;
  height: 100%;
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
}
</style>
