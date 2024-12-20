<template>
  <div class="blog-complete-container">
    <div>
      <!-- 博客左侧内容 -->
    </div>
    <!--博客主体-->
    <div class="blog-container">
      <GlobalLoading />
      <div>
        <!-- 写一个rss生成器的组件,并添加对应rss生成的功能 -->
        <RSSGenerator :articles="markdownFiles" />
      </div>
      <div>
        <header class="blog-header">
          <h1>江湖夜雨十年灯</h1>
          <p>一壶浊酒尽余欢，今宵别梦寒。</p>
        </header>
        <!-- 使用transition-group来包裹li列表，添加动画 -->
        <transition-group
          name="fade"
          tag="ul"
          class="blog-list"
          v-if="isContentLoaded"
        >
          <li
            v-for="(file, index) in markdownFiles"
            :key="file.name"
            @click="goToArticle(file)"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <h2>{{ file.title }}</h2>
            <p>{{ file.daysAgo }} 天前</p>
          </li>
        </transition-group>
      </div>
    </div>
    <!-- 博客右侧内容 -->
    <div class="blog-right-person">
      <div style="max-width: 25%">
        <img
          style="width: 100%; height: 100%"
          src="https://github.com/WindyDante.png"
          alt=""
        />
      </div>
      <div class="personMe">myName:WindyDante.EastWind</div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref, onMounted, watch } from "vue";
import { loadingState } from "@/stores/loading";
import GlobalLoading from "@/components/GlobalLoading.vue";
import RSSGenerator from "@/components/RSSGenerator.vue";

const store = useStore();
const router = useRouter();

const markdownFiles = ref([]);
const isContentLoaded = ref(false);

const loadFromCache = () => {
  const cachedData = sessionStorage.getItem("markdownFiles");
  return cachedData ? JSON.parse(cachedData) : null;
};

const ensureDataLoaded = async () => {
  if (store.state.markdownFiles.length === 0) {
    await store.dispatch("loadMarkdownFiles");
  }
  const cachedData = loadFromCache();
  if (cachedData) {
    markdownFiles.value = cachedData;
  } else {
    markdownFiles.value = store.state.markdownFiles.map((file) => ({
      name: file.name,
      date: file.created,
      title: file.title,
      daysAgo: file.daysAgo + 1,
    }));
    markdownFiles.value.sort((a, b) => a.daysAgo - b.daysAgo);
    sessionStorage.setItem(
      "markdownFiles",
      JSON.stringify(markdownFiles.value)
    );
  }
};

const goToArticle = (file) => {
  router.push({
    name: "Content",
    params: {
      title: file.title,
    },
  });
};

watch(
  () => router.currentRoute.value,
  async () => {
    loadingState.show("正在加载页面...");
    isContentLoaded.value = false;
    try {
      if (router.currentRoute.value.name === "Main") {
        await ensureDataLoaded();
      }
    } finally {
      loadingState.hide();
      isContentLoaded.value = true;
    }
  }
);

onMounted(async () => {
  loadingState.show("正在加载页面...");
  try {
    await ensureDataLoaded();
  } catch {
    console.error("加载失败");
  } finally {
    loadingState.hide();
    isContentLoaded.value = true;
  }
});
</script>

<style scoped>
.blog-right-person {
  max-width: 100%;
  height: 100%;
  border: 1px solid #e6e6e6;
}
.blog-complete-container {
  display: flex;
  justify-content: space-between;
  padding: 20px 0px;
}

.blog-header {
  text-align: center;
  margin-bottom: 20px;
}

.blog-header h1 {
  font-size: 2.5em;
}

.blog-header p {
  font-size: 1.2em;
}

.blog-list {
  text-align: center;
  list-style: none;
  padding: 0;
  margin: 0;
}

.blog-list li {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
  opacity: 0; /* 初始透明 */
  transform: translateY(20px); /* 初始偏移 */
  animation: fadeIn 0.6s ease-out forwards; /* 使用动画 */
}

.blog-list h2 {
  margin: 0;
  font-size: 1.5em;
}

.blog-list p {
  margin: 0;
  font-size: 0.9em;
}

/* 动画效果 */
@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 控制li出现的顺序 */
.blog-list li:nth-child(n) {
  animation-delay: calc(0.1s * var(--index));
}

.blog-list li.fade-enter-active,
.blog-list li.fade-leave-active {
  transition: opacity 1s ease;
}

.blog-list li.fade-enter,
.blog-list li.fade-leave-to {
  opacity: 0;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .blog-header h1 {
    font-size: 2em;
  }

  .blog-header p {
    font-size: 1em;
  }

  .blog-list h2 {
    font-size: 1.25em;
  }

  .blog-list p {
    font-size: 0.8em;
  }
}

@media (max-width: 480px) {
  .blog-header h1 {
    font-size: 1.5em;
  }

  .blog-header p {
    font-size: 0.9em;
  }

  .blog-list h2 {
    font-size: 1.1em;
  }

  .blog-list p {
    font-size: 0.7em;
  }
}
</style>
