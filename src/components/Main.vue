<template>
  <div id="main">
    <div class="file-list-container">
      <h2>Markdown 文件列表</h2>
      <ul>
        <li
          v-for="file in markdownFiles"
          :key="file.name"
          @click="loadMarkdownFile(file.name)"
          class="file-item"
        >
          {{ file.title }} - {{ file.daysAgo }} 天前
        </li>
      </ul>
    </div>
    <div class="content-container">
      <div v-html="markdownContent" class="markdown-content"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from "vue"; // 确保导入 nextTick
import { marked } from "marked";

export default {
  setup() {
    const markdownFiles = ref([]); // 存储文件名及其元数据
    const markdownContent = ref(""); // 存储当前 Markdown 内容

    // 计算从创建日期到现在的天数差
    const calculateDaysAgo = (dateString) => {
      const createdDate = new Date(dateString);
      const now = new Date();
      const timeDiff = now - createdDate;
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      return daysDiff;
    };

    // 加载文件列表
    const loadMarkdownFiles = async () => {
      const files = import.meta.glob("/public/markdowns/*.md");
      const fileList = Object.keys(files).map(async (filePath) => {
        const fileName = filePath.replace("/public/markdowns/", "");
        const response = await fetch(
          `${import.meta.env.BASE_URL}markdowns/${encodeURIComponent(fileName)}`
        );
        const data = await response.text();

        // 提取标题和创建日期
        const titleMatch = data.match(/title:\s*(.*)/);
        const dateMatch = data.match(/date:\s*(.*)/);

        return {
          name: fileName,
          title: titleMatch ? titleMatch[1].trim() : fileName,
          created: dateMatch ? dateMatch[1].trim() : null,
          daysAgo: dateMatch ? calculateDaysAgo(dateMatch[1].trim()) : null,
        };
      });

      // 等待所有 Promise 完成
      markdownFiles.value = await Promise.all(fileList);
    };

    // 加载具体 Markdown 文件内容
    const loadMarkdownFile = async (fileName) => {
      try {
        const baseUrl = import.meta.env.BASE_URL; // 获取基础路径
        const response = await fetch(
          `${baseUrl}markdowns/${encodeURIComponent(fileName)}`
        );
        const data = await response.text();

        // 使用正则表达式去除 Markdown 开头的元数据部分
        const contentWithoutMetadata = data
          .replace(/---[\s\S]*?---/, "")
          .trim();

        markdownContent.value = marked(contentWithoutMetadata); // 显示过滤后的内容

        // 使用 nextTick 确保在 DOM 更新后执行
        await nextTick();

        // 获取类名为 markdown-content 的元素
        const imgsContainer = document.querySelector(".markdown-content");

        // 获取该元素下的所有 img 标签，包括嵌套在 p 标签中的 img
        const imgList = imgsContainer.querySelectorAll("img");

        // 遍历每个 img 标签并设置其宽度
        imgList.forEach((img) => {
          img.onload = () => {
            // 检查 img 的宽度是否大于其父元素的宽度
            if (img.offsetWidth > img.parentElement.offsetWidth) {
              img.style.width = "100%"; // 如果大于，设置为100%
            }
          };

          // 如果图片已经加载（例如缓存的情况），也要立即设置宽度
          if (img.complete) {
            img.onload(); // 手动触发 onload 事件
          }
        });
      } catch (error) {
        console.error("Error loading markdown file:", error);
      }
    };

    onMounted(() => {
      loadMarkdownFiles(); // 页面加载时获取文件列表
    });

    return {
      markdownFiles,
      markdownContent,
      loadMarkdownFile,
    };
  },
};
</script>
<style scoped>
/* 背景样式 */
body {
  background-color: #f5f5dc; /* 米色背景 */
  font-family: "SimSun", "KaiTi", serif; /* 古风字体 */
}

/* 全局容器 */
#main {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
  justify-content: center; /* 中心对齐 */
}

/* 文件列表容器 */
.file-list-container {
  flex: 1;
  margin-right: 20px;
  text-align: center; /* 文字居中 */
}

/* 文件列表样式 */
ul {
  list-style-type: none;
  padding: 0;
}

.file-item {
  cursor: pointer;
  padding: 10px;
  background-color: #e8e8e8; /* 灰色背景 */
  margin-bottom: 10px;
  border-radius: 8px;
  transition: background-color 0.3s, transform 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}

.file-item:hover {
  background-color: #d0d0d0; /* 鼠标悬停变色 */
  transform: scale(1.02);
}

.file-item:active {
  background-color: #b0b0b0;
}

/* Markdown 内容展示 */
.content-container {
  flex: 3;
  padding: 20px;
  background-color: #fff; /* 白色背景 */
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  overflow: hidden; /* 去除滚动条 */
}

/* Markdown 内容样式 */
.markdown-content {
  font-size: 16px;
  line-height: 1.6;
  overflow: hidden; /* 去除滚动条 */
}

/* 限制图片大小 */
.markdown-content img {
  max-width: 100%; /* 最大宽度为100% */
  height: auto; /* 自动调整高度，保持比例 */
  display: block; /* 确保图片是块级元素，以避免下方空隙 */
}

/* PC 端适配 */
@media (min-width: 768px) {
  #main {
    flex-direction: row;
  }

  .file-list-container {
    width: 30%;
  }

  .content-container {
    width: 70%;
  }
}

/* 移动端适配 */
@media (max-width: 767px) {
  #main {
    flex-direction: column;
    padding: 10px;
  }

  .file-list-container {
    width: 100%;
    margin-bottom: 20px;
  }

  .content-container {
    width: 100%;
    padding: 15px;
  }

  .file-item {
    font-size: 18px;
  }

  .markdown-content {
    font-size: 14px;
  }
}
</style>
