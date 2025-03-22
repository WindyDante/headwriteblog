<template>
  <div class="ai-assistant" v-show="showAssistant" @click="toggleAssistant">
    <div class="ai-orb"></div>
    <div class="ai-message" v-if="assistantActive">
      <p>我能为您提供什么帮助？</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AIAssistant',
  props: {
    showAssistant: {
      type: Boolean,
      default: false
    },
    assistantActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleAssistant() {
      this.$emit('toggle-assistant');
    }
  }
};
</script>

<style>
/* AI助手彩蛋 */
.ai-assistant {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
}

.ai-orb {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(100, 100, 255, 0.8) 0%, rgba(192, 86, 192, 0.8) 100%);
  box-shadow: 0 0 20px rgba(100, 100, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  animation: orbPulse 2s ease-in-out infinite;
}

@keyframes orbPulse {
  0% { transform: scale(1); box-shadow: 0 0 20px rgba(100, 100, 255, 0.7); }
  50% { transform: scale(1.1); box-shadow: 0 0 30px rgba(100, 100, 255, 0.9); }
  100% { transform: scale(1); box-shadow: 0 0 20px rgba(100, 100, 255, 0.7); }
}

.ai-message {
  position: absolute;
  bottom: 60px;
  right: 0;
  background: rgba(30, 30, 70, 0.9);
  border: 1px solid rgba(100, 100, 255, 0.3);
  border-radius: 15px;
  padding: 1rem;
  width: 200px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  animation: messageAppear 0.3s ease-out;
}

@keyframes messageAppear {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

.ai-message p {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(200, 200, 255, 0.9);
}

.ai-message::before {
  content: '';
  position: absolute;
  bottom: -10px;
  right: 20px;
  width: 20px;
  height: 20px;
  background: rgba(30, 30, 70, 0.9);
  border-right: 1px solid rgba(100, 100, 255, 0.3);
  border-bottom: 1px solid rgba(100, 100, 255, 0.3);
  transform: rotate(45deg);
}
</style>