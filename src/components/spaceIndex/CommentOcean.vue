<template>
  <section class="comment-ocean">
    <div class="ocean-background"></div>
    <div class="comment-bubbles">
      <div v-for="(comment, index) in comments" :key="index" 
           class="comment-bubble"
           :style="{ 
             animationDelay: `${index * 0.5}s`,
             animationDuration: `${5 + Math.random() * 5}s`
           }">
        <p>{{ comment.content }}</p>
        <div class="comment-author">{{ comment.author }}</div>
        <button class="like-btn" @click="likeComment(index)" :class="{ liked: comment.liked }">
          <span class="jellyfish-icon">🌟</span>
          <span class="like-count">{{ comment.likes }}</span>
        </button>
      </div>
    </div>
    <div class="voice-comment">
      <button @click="startVoiceComment">去 评 论 区 看 看 吧 ! </button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CommentOcean',
  props: {
    comments: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 点赞评论
    likeComment(index) {
      if (!this.comments[index].liked) {
        this.comments[index].likes++;
        this.comments[index].liked = true;
      } else {
        this.comments[index].likes--;
        this.comments[index].liked = false;
      }
    },
    
    // 语音评论
    startVoiceComment() {
      this.$router.push('/comments');
    }
  }
};
</script>

<style>
/* 动态评论生态圈 */
.comment-ocean {
  position: relative;
  padding: 4rem 2rem;
  min-height: 400px;
  overflow: hidden;
}

.ocean-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(10, 10, 40, 0.8), rgba(0, 20, 80, 0.8));
  z-index: -1;
}

.comment-bubbles {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  padding: 2rem 0;
}

.comment-bubble {
  background: rgba(100, 150, 255, 0.2);
  border: 1px solid rgba(100, 150, 255, 0.4);
  border-radius: 20px;
  padding: 1.2rem;
  width: 280px;
  position: relative;
  animation: bubbleFloat linear infinite;
}

@keyframes bubbleFloat {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(2deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}

.comment-bubble::before {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 20px;
  width: 20px;
  height: 20px;
  background: rgba(100, 150, 255, 0.2);
  border-right: 1px solid rgba(100, 150, 255, 0.4);
  border-bottom: 1px solid rgba(100, 150, 255, 0.4);
  transform: rotate(45deg);
}

.comment-author {
  margin-top: 0.8rem;
  font-weight: bold;
  font-size: 0.9rem;
  color: rgba(200, 200, 255, 0.9);
}

.like-btn {
  position: absolute;
  bottom: -15px;
  right: 20px;
  background: rgba(30, 30, 70, 0.8);
  border: 1px solid rgba(100, 100, 255, 0.3);
  border-radius: 20px;
  padding: 0.3rem 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.like-btn:hover {
  background: rgba(50, 50, 100, 0.8);
}

.like-count {
  font-size: 0.8rem;
  color: rgba(200, 200, 255, 0.9);
}
.like-btn.liked {
  background: rgba(192, 86, 192, 0.4);
  border-color: rgba(192, 86, 192, 0.7);
}

.jellyfish-icon {
  font-size: 1rem;
}

.voice-comment {
  text-align: center;
  margin-top: 2rem;
}

.voice-comment button {
  background: rgba(192, 86, 192, 0.3);
  border: 1px solid rgba(192, 86, 192, 0.7);
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-style: italic;
}

.voice-comment button:hover {
  background: rgba(192, 86, 192, 0.5);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
</style>