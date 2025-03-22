<template>
  <div class="space-blog">
    <!-- 动态星际背景 -->
    <SpaceBackground />
    
    <!-- 星际导航系统 -->
    <SpaceNavigation />
    
    <!-- 沉浸式内容展示区 -->
    <ContentGalaxy :articles="articles" />
    
    <!-- 交互式时间轴侧边栏 -->
    <TimelineSidebar :timeline="timeline" />
    
    <!-- 智能内容矩阵 -->
    <TopicHoneycomb :topics="topics" />
    
    <!-- 全息作者空间站 -->
    <AuthorStation :skills="skills" />
    
    <!-- 动态评论生态圈 -->
    <CommentOcean :comments="comments" />
    
    <!-- 智能推荐星图 -->
    <RecommendationStarmap :recommendationClusters="recommendationClusters" />
    
    <!-- 多维度内容入口 -->
    <SpaceshipDashboard />
    
    <!-- AI助手彩蛋 -->
    <AIAssistant 
      :showAssistant="showAssistant" 
      :assistantActive="assistantActive"
      @toggle-assistant="toggleAssistant" />
  </div>
</template>

<script>
// 导入所有子组件
import SpaceBackground from './space/SpaceBackground.vue';
import SpaceNavigation from './space/SpaceNavigation.vue';
import ContentGalaxy from './space/ContentGalaxy.vue';
import TimelineSidebar from './space/TimelineSidebar.vue';
import TopicHoneycomb from './space/TopicHoneycomb.vue';
import AuthorStation from './space/AuthorStation.vue';
import CommentOcean from './space/CommentOcean.vue';
import RecommendationStarmap from './space/RecommendationStarmap.vue';
import SpaceshipDashboard from './space/SpaceshipDashboard.vue';
import AIAssistant from './space/AIAssistant.vue';

export default {
  name: 'SpaceBlogContainer',
  components: {
    SpaceBackground,
    SpaceNavigation,
    ContentGalaxy,
    TimelineSidebar,
    TopicHoneycomb,
    AuthorStation,
    CommentOcean,
    RecommendationStarmap,
    SpaceshipDashboard,
    AIAssistant
  },
  data() {
    return {
      // 文章数据
      articles: [
        {
          title: '量子计算的未来展望',
          image: '/placeholder.svg?height=200&width=300',
          summary: '探索量子计算如何改变我们的技术世界，以及它对密码学的影响...',
          flipped: false
        },
        {
          title: '深空探索新发现',
          image: '/placeholder.svg?height=200&width=300',
          summary: '最新的深空探测器传回了令人惊讶的数据，科学家们正在解读这些信息...',
          flipped: false
        },
        {
          title: '人工智能创作艺术',
          image: '/placeholder.svg?height=200&width=300',
          summary: '当AI开始创作艺术，我们如何定义创造力？一场关于艺术本质的探讨...',
          flipped: false
        },
        {
          title: '未来城市设计理念',
          image: '/placeholder.svg?height=200&width=300',
          summary: '可持续发展与科技融合，未来城市将如何满足人类需求并保护环境...',
          flipped: false
        }
      ],
      
      // 时间轴数据
      timeline: [
        { year: '2024', items: ['Web3革命', '量子通信突破', '生成式AI崛起'], expanded: false },
        { year: '2023', items: ['Web3革命', '量子通信突破', '生成式AI崛起'], expanded: false },
        { year: '2022', items: ['Web3革命', '量子通信突破', '生成式AI崛起'], expanded: false },
        { year: '2021', items: ['Web3革命', '量子通信突破', '生成式AI崛起'], expanded: false }
      ],
      
      // 主题矩阵数据
      topics: [
        { name: '人工智能', count: 42, popularity: 0.9, color: 'rgba(64, 196, 255, 0.7)' },
        { name: '太空探索', count: 28, popularity: 0.7, color: 'rgba(147, 51, 234, 0.7)' },
        { name: '量子计算', count: 15, popularity: 0.5, color: 'rgba(236, 72, 153, 0.7)' },
        { name: '生物科技', count: 31, popularity: 0.8, color: 'rgba(52, 211, 153, 0.7)' },
        { name: '可持续发展', count: 24, popularity: 0.6, color: 'rgba(251, 146, 60, 0.7)' },
        { name: '数字艺术', count: 19, popularity: 0.5, color: 'rgba(167, 139, 250, 0.7)' }
      ],
      
      // 作者技能数据
      skills: [
        { name: '前端开发', description: '精通Vue、React、WebGL等前端技术，创建沉浸式web体验', expanded: false },
        { name: 'AI研究', description: '专注于生成式AI和机器学习在创意领域的应用', expanded: false },
        { name: '太空科学', description: '业余天文学家，关注最新的太空探索和天体物理学发现', expanded: false }
      ],
      
      // 评论数据
      comments: [
        { author: '星际旅行者', content: '这篇文章让我对量子计算有了全新的理解！', likes: 15, liked: false },
        { author: '代码诗人', content: '文章的比喻非常生动，技术解释也很到位。', likes: 8, liked: false },
        { author: '未来主义者', content: '我认为这个技术在5年内会彻底改变我们的生活方式。', likes: 12, liked: false },
        { author: '科学探索家', content: '有没有考虑过在低温环境下的应用场景？', likes: 5, liked: false }
      ],
      
      // 推荐星图数据
      recommendationClusters: [
        {
          name: '技术星系',
          articles: []
        },
        {
          name: '创意星系',
          articles: []
        }
      ],
      
      // AI助手状态
      showAssistant: false,
      assistantActive: false
    };
  },
  created() {
    // 初始化星星数据，确保每个星星有固定的缩放值
    this.initStarArticles();
  },
  mounted() {
    // 双击监听彩蛋
    document.addEventListener('dblclick', this.handleDoubleClick);
  },
  beforeUnmount() {
    document.removeEventListener('dblclick', this.handleDoubleClick);
    document.removeEventListener('click', this.closeAllMenus);
  },
  methods: {
    // 初始化星星数据
    initStarArticles() {
      // 技术星系文章
      const techArticles = [
        { title: 'WebGL高级渲染技术', id: 101, position: { x: 30, y: 30 }, isDragging: false },
        { title: '神经网络架构设计', id: 102, position: { x: 60, y: 40 }, isDragging: false },
        { title: '量子加密实践指南', id: 103, position: { x: 45, y: 70 }, isDragging: false }
      ];
      
      // 创意星系文章
      const creativeArticles = [
        { title: '数字艺术创作工具比较', id: 201, position: { x: 35, y: 35 }, isDragging: false },
        { title: '生成式设计的美学原则', id: 202, position: { x: 65, y: 50 }, isDragging: false },
        { title: '沉浸式叙事技巧', id: 203, position: { x: 50, y: 65 }, isDragging: false }
      ];
      
      // 为每个星星分配固定的缩放值，而不是每次渲染时重新计算
      [...techArticles, ...creativeArticles].forEach(article => {
        article.scale = 0.5 + Math.random() * 0.5;
      });
      
      // 更新星系数据
      this.recommendationClusters[0].articles = techArticles;
      this.recommendationClusters[1].articles = creativeArticles;
    },
    
    // 双击彩蛋
    handleDoubleClick() {
      this.showAssistant = !this.showAssistant;
    },
    
    // 切换AI助手状态
    toggleAssistant() {
      this.assistantActive = !this.assistantActive;
    }
  }
};
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  overflow-x: hidden;
  color: #e0e0ff;
  background-color: #050520;
}

.space-blog {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
}
</style>