<template>
  <div class="blog-container">
    <header class="blog-header">
      <h1>江湖夜雨十年灯</h1>
      <p>一壶浊酒尽余欢，今宵别梦寒。</p>
    </header>
    <ul class="blog-list">
      <li
        v-for="file in markdownFiles"
        :key="file.name"
        @click="goToArticle(file.name)"
      >
        <h2>{{ file.title }}</h2>
        <p>{{ file.daysAgo }} 天前</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router"; // 导入 useRouter

export default {
  setup() {
    const markdownFiles = ref([]);
    const router = useRouter(); // 初始化 Vue Router

    const loadMarkdownFiles = async () => {
      const files = import.meta.glob("/public/markdowns/*.md");
      const fileList = Object.keys(files).map(async (filePath) => {
        const fileName = filePath.replace("/public/markdowns/", "");
        const response = await fetch(
          `${import.meta.env.BASE_URL}markdowns/${encodeURIComponent(fileName)}`
        );
        const data = await response.text();
        const titleMatch = data.match(/title:\s*(.*)/);
        const dateMatch = data.match(/date:\s*(.*)/);

        return {
          name: fileName,
          title: titleMatch ? titleMatch[1].trim() : fileName,
          created: dateMatch ? dateMatch[1].trim() : null,
          daysAgo: dateMatch ? calculateDaysAgo(dateMatch[1].trim()) : null,
        };
      });

      markdownFiles.value = await Promise.all(fileList);
    };

    const goToArticle = (fileName) => {
      router.push({ name: "Content", params: { fileName } }); // 跳转到 Content 页面
    };

    const calculateDaysAgo = (dateString) => {
      const createdDate = new Date(dateString);
      const now = new Date();
      const timeDiff = now - createdDate;
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      return daysDiff;
    };

    onMounted(() => {
      loadMarkdownFiles();
    });

    return {
      markdownFiles,
      goToArticle,
    };
  },
};
</script>

<style scoped>
.blog-container {
  background-size: cover;
  padding: 20px;
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
}

.blog-list li {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.blog-list h2 {
  margin: 0;
  font-size: 1.5em;
}

.blog-list p {
  margin: 0;
  font-size: 0.9em;
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

