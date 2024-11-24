import { reactive } from 'vue';

export const loadingState = reactive({
  isLoading: false, // 控制加载状态
  show(message = '加载中...') {
    this.isLoading = true;
    this.message = message;
  },
  hide() {
    this.isLoading = false;
    this.message = '';
  },
  message: '', // 加载时的提示信息
});
