<template>
  <div>
    <ul>
      <li v-for="file in markdownFiles" :key="file.name">
        {{ file.title }}
        {{ file.daysAgo }}
      </li>
    </ul>
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
</style>
