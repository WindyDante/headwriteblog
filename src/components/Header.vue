<template>
  <div id="header">
    <div class="title">
      <div class="titleLeft">WinDy</div>
      <div class="titleCenter">
        <a href="#/"><div>文章</div></a>
        <a href="#/life">生活</a>
        <a href="#/messageBoard">留言板</a>
        <a href="#/friends">友链</a>
      </div>
      <!-- <div class="titleRight" v-if="isMobile">闲话</div> -->
    </div>
  </div>
</template>

<style scoped>
#header {
  width: 100%;
  background: #9309e4;
  transition: background 0.3s ease;
}

.title {
  color: #e9f1f6;
  font-size: 1.5rem; /* 使用相对单位 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  height: 60px; /* 提高高度以便更好显示 */
  white-space: nowrap; /* 防止换行 */
  overflow: hidden; /* 隐藏溢出的内容 */
}

.titleCenter {
  display: flex;
  flex-grow: 2; /* 增加 flex-grow 值，使其占据更多空间 */
  align-items: center;
  justify-content: space-around;
}

.titleCenter a {
  cursor: pointer;
  transition: color 0.3s, transform 0.3s;
}

.titleCenter a:hover {
  color: #b0a4e3; /* 悬停时改变颜色 */
  transform: scale(1.1); /* 悬停时放大 */
}

.titleLeft {
  white-space: nowrap; /* 防止换行 */
}

.titleRight {
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
    height: 60px; /* 保持固定高度以适应一行显示 */
    flex-direction: row; /* 保持横向排列 */
  }
}

/* 去除a标签的默认下划线 */
a {
text-decoration: none;
}

/* 去除a标签的默认颜色 */
a {
color: inherit;
}

/* 去除a标签被点击时的外部轮廓线 */
a:focus {
outline: none;
}

/* 去除a标签的不同状态下的下划线 */
a:link,
a:visited,
a:hover,
a:active {
text-decoration: none;
}
</style>
