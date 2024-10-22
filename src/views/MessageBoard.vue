<template>
  <div>
    <div class="boardFont">
      亲爱的小伙伴们可以在这里为我留下你想对我说的话哦！
    </div>
    <Twikoo />
  </div>
</template>

<script>
import Twikoo from "@/components/Twikoo.vue"; // 根据实际路径引入组件

export default {
  components: {
    Twikoo,
  },
};
</script>

<style scoped>
.boardFont {
  padding-top: 20px;
  text-align: center;
  font-size: 1.5em; /* 默认字体大小 */
  animation: colorChange 7s infinite; /* 持续时间与循环 */
}

@keyframes colorChange {
  0% {
    color: red;
  }
  14.3% {
    color: orange;
  }
  28.6% {
    color: yellow;
  }
  42.9% {
    color: green;
  }
  57.2% {
    color: cyan;
  }
  71.5% {
    color: blue;
  }
  85.8% {
    color: purple;
  }
  100% {
    color: red;
  } /* 回到起始色 */
}

/* 自适应样式 */
@media (max-width: 768px) {
  .boardFont {
    font-size: 1.2em; /* 移动端字体大小 */
  }
}

@media (max-width: 480px) {
  .boardFont {
    font-size: 1em; /* 更小屏幕的字体大小 */
  }
}
</style>
