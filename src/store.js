import { createStore } from "vuex";

// 计算日期差（天数）
const calculateDaysAgo = (dateString) => {
  const createdDate = new Date(dateString);
  const now = new Date();
  const timeDiff = now - createdDate;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
};

export default createStore({
  state: {
    markdownFiles: [], // 用于存储 markdown 文件的标题、日期和原始内容
  },
  mutations: {
    setMarkdownFiles(state, files) {
      state.markdownFiles = files; // 更新 markdown 文件列表
    },
  },
  actions: {
    async loadMarkdownFiles({ commit }) {
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
          name: fileName, // 文件名
          title: titleMatch ? titleMatch[1].trim() : "无标题", // 提取标题
          created: dateMatch ? dateMatch[1].trim() : "未知日期", // 提取创建日期
          daysAgo: dateMatch ? calculateDaysAgo(dateMatch[1].trim()) : "未知", // 计算多少天前
          content: data.replace(/---[\s\S]*?---/, "").trim(), // 去除 YAML metadata 和获取文章内容
        };
      });

      const markdownFiles = await Promise.all(fileList);
      commit("setMarkdownFiles", markdownFiles); // 提交 mutation 更新 state
    },
  },
  getters: {
    getArticleByTitle: (state) => (title) => {
      // 根据标题返回对应的文章内容
      const article = state.markdownFiles.find((file) => file.title === title);
      return article ? article.content : null;
    },
  },
});
