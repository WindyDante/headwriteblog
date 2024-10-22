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
        @click="loadMarkdownFile(file.name)"
      >
        <h2>{{ file.title }}</h2>
        <p>{{ file.daysAgo }} 天前</p>
      </li>
    </ul>
    <div v-if="showOverlay" class="overlay" @click="closeOverlay">
      <div class="overlay-content" @click.stop>
        <div v-html="markdownContent"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from "vue";
import { marked } from "marked";

export default {
  setup() {
    const markdownFiles = ref([]);
    const markdownContent = ref("");
    const showOverlay = ref(false);

    const calculateDaysAgo = (dateString) => {
      const createdDate = new Date(dateString);
      const now = new Date();
      const timeDiff = now - createdDate;
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      return daysDiff;
    };

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

    const loadMarkdownFile = async (fileName) => {
      try {
        const baseUrl = import.meta.env.BASE_URL;
        const response = await fetch(
          `${baseUrl}markdowns/${encodeURIComponent(fileName)}`
        );
        const data = await response.text();
        const contentWithoutMetadata = data
          .replace(/---[\s\S]*?---/, "")
          .trim();

        markdownContent.value = marked(contentWithoutMetadata);
        showOverlay.value = true;

        await nextTick(() => {
          adjustImageWidths();
        });
      } catch (error) {
        console.error("Error loading markdown file:", error);
      }
    };

    const closeOverlay = () => {
      showOverlay.value = false;
    };

    const adjustImageWidths = () => {
      const images = document.querySelectorAll(".overlay-content img");
      images.forEach((img) => {
        img.onload = () => {
          const containerWidth = img.parentElement.clientWidth;
          if (img.width > containerWidth) {
            img.style.width = "100%";
          }
        };

        // Check if the image is already loaded
        if (img.complete) {
          const containerWidth = img.parentElement.clientWidth;
          if (img.width > containerWidth) {
            img.style.width = "100%";
          }
        }
      });
    };

    onMounted(() => {
      loadMarkdownFiles();
    });

    return {
      markdownFiles,
      markdownContent,
      showOverlay,
      loadMarkdownFile,
      closeOverlay,
      adjustImageWidths,
    };
  },
};
</script>

<style scoped>
.blog-container {
  background: url("/path/to/your/background-image.jpg") no-repeat center center
    fixed;
  background-size: cover;
  color: #333;
  font-family: "KaiTi", serif;
  padding: 20px;
}

.blog-header {
  text-align: center;
  margin-bottom: 20px;
}

.blog-header h1 {
  font-size: 2.5em;
  color: #333;
}

.blog-header p {
  font-size: 1.2em;
  color: #666;
}

.blog-list {
  text-align: center;
  list-style: none;
  padding: 0;
}

.blog-list li {
  background: rgba(255, 255, 255, 0.8);
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.blog-list li:hover {
  background: rgba(255, 255, 255, 1);
}

.blog-list h2 {
  margin: 0;
  font-size: 1.5em;
  color: #333;
}

.blog-list p {
  margin: 0;
  font-size: 0.9em;
  color: #999;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.5s;
  overflow-y: auto;
}

.overlay-content {
  background: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 5px;
  max-width: 80%;
  max-height: 80%;
  overflow-y: auto;
  overflow-x: hidden; /* Prevent horizontal scrolling */
  animation: slideIn 0.5s;
}

.overlay-content img {
  max-width: 100%;
  height: auto;
}

.overlay-content::-webkit-scrollbar {
  width: 8px;
}

.overlay-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
}

.overlay-content::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
  }
  to {
    transform: translateY(0);
  }
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

  .overlay-content {
    padding: 20px;
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
