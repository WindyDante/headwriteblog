<template>
  <div class="space-station category-detail">
    <!-- 返回主页按钮 -->
    <button class="home-portal" @click="$router.push('/')">
      <div class="portal-icon"></div>
      <span class="portal-text"></span>
    </button>

    <!-- Category Info Banner -->
    <div class="category-banner" :class="currentCategory.type">
      <div class="banner-particles" ref="bannerParticles"></div>
      <div class="banner-content">
        <h1>{{ currentCategory.name }}</h1>
        <div class="category-stats">
          <div class="stat-item">
            <span class="stat-value">{{ currentCategory.articleCount }}</span>
            <span class="stat-label">文章总数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ getUpdateFrequencyText(currentCategory.updateFrequency) }}</span>
            <span class="stat-label">更新频率</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ getPopularityText(categoryPopularity) }}</span>
            <span class="stat-label">热度指数</span>
          </div>
        </div>
        <p class="category-description">{{ getCategoryDescription(currentCategory.type) }}</p>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="category-content">
      <!-- Filter Section -->
      <div class="filter-section">
        <div class="search-box">
          <div class="search-input-wrapper">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="搜索文章..." 
              class="search-input"
            />
            <span class="search-icon">🔍</span>
          </div>
          <button class="search-button">
            <span class="button-text">搜索</span>
            <span class="button-glow"></span>
          </button>
        </div>
        
        <div class="filter-options">
          <div class="filter-group">
            <label>时间范围</label>
            <div class="select-wrapper">
              <select v-model="timeFilter" class="filter-select">
                <option value="all">全部时间</option>
                <option value="month">近一个月</option>
                <option value="quarter">近三个月</option>
                <option value="halfyear">近半年</option>
                <option value="year">近一年</option>
              </select>
              <span class="select-arrow">▼</span>
            </div>
          </div>
          
          <div class="filter-group">
            <label>排序方式</label>
            <div class="select-wrapper">
              <select v-model="sortBy" class="filter-select">
                <option value="date-desc">最新发布</option>
                <option value="date-asc">最早发布</option>
                <option value="popularity-desc">热度最高</option>
                <option value="title-asc">标题 A-Z</option>
              </select>
              <span class="select-arrow">▼</span>
            </div>
          </div>
          
          <div class="filter-group tags">
            <label>标签筛选</label>
            <div class="tag-container">
              <span 
                v-for="tag in categoryTags" 
                :key="tag.id" 
                @click="toggleTag(tag.id)"
                :class="{ 'selected': selectedTags.includes(tag.id) }"
                class="tag-item"
              >
                <span class="tag-pulse" v-if="selectedTags.includes(tag.id)"></span>
                {{ tag.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Articles List -->
      <div class="articles-container">
        <h2 class="section-title">
          文章列表 
          <span class="article-count">({{ filteredArticles.length }})</span>
        </h2>
        
        <div v-if="filteredArticles.length > 0" class="articles-grid">
          <div 
            v-for="article in filteredArticles" 
            :key="article.id" 
            class="article-card"
            :class="{ 'featured': article.isFeatured }"
          >
            <div class="article-glow" :style="{ '--glow-color': getCategoryColor(currentCategory.type) }"></div>
            <div class="article-content">
              <div class="article-meta">
                <span class="article-date">{{ formatDate(article.date) }}</span>
                <span v-if="article.isFeatured" class="featured-badge">
                  <span class="badge-star">★</span> 精选
                </span>
              </div>
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-excerpt">{{ article.excerpt }}</p>
              <div class="article-footer">
                <div class="article-tags">
                  <span 
                    v-for="tagId in article.tagIds" 
                    :key="tagId" 
                    class="article-tag"
                  >
                    {{ getTagName(tagId) }}
                  </span>
                </div>
                <div class="article-stats">
                  <span class="stat"><span class="icon">👁️</span> {{ article.views }}</span>
                  <span class="stat"><span class="icon">💬</span> {{ article.comments }}</span>
                  <span class="stat"><span class="icon">⭐</span> {{ article.stars }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="no-articles">
          <div class="empty-state">
            <div class="empty-animation"></div>
            <p>没有找到符合条件的文章</p>
            <button @click="resetFilters" class="reset-button">
              <span class="button-text">重置筛选条件</span>
              <span class="button-glow"></span>
            </button>
          </div>
        </div>
        
        <div v-if="filteredArticles.length > 0" class="pagination">
          <button 
            @click="currentPage > 1 && (currentPage--)" 
            :disabled="currentPage === 1"
            class="page-button prev-button"
          >
            <span class="page-arrow">◀</span> 上一页
          </button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button 
            @click="currentPage < totalPages && (currentPage++)" 
            :disabled="currentPage === totalPages"
            class="page-button next-button"
          >
            下一页 <span class="page-arrow">▶</span>
          </button>
        </div>
      </div>
      
      <!-- Related Categories -->
      <div class="related-categories">
        <h2 class="section-title">相关星系</h2>
        <div class="related-grid">
          <div 
            v-for="category in relatedCategories" 
            :key="category.id" 
            class="related-card"
            :class="category.type"
            @click="navigateToCategory(category.id)"
          >
            <div class="related-particle-container"></div>
            <h3>{{ category.name }}</h3>
            <span class="article-count">{{ category.articleCount }} 篇文章</span>
            <div class="card-hover-effect"></div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import * as THREE from 'three';

export default {
  name: 'CategoryDetail',
  props: {
    categoryId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    // State
    const isDarkMode = ref(true);
    const showRecommendations = ref(false);
    const searchQuery = ref('');
    const timeFilter = ref('all');
    const sortBy = ref('date-desc');
    const selectedTags = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(9);
    const bannerParticles = ref(null);

    // Sample data
    const categories = ref([
      { id: 1, name: '技术星系', type: 'tech', articleCount: 128, updateFrequency: 0.8 },
      { id: 2, name: 'Java星球', type: 'java', articleCount: 95, updateFrequency: 0.6 },
      { id: 3, name: '前端小行星带', type: 'frontend', articleCount: 112, updateFrequency: 0.9 },
      { id: 4, name: '人工智能星云', type: 'ai', articleCount: 76, updateFrequency: 0.7 },
      { id: 5, name: '数据库黑洞', type: 'database', articleCount: 64, updateFrequency: 0.5 },
      { id: 6, name: '云计算星团', type: 'cloud', articleCount: 83, updateFrequency: 0.65 }
    ]);

    // Extended article data for the category detail page
    const allArticles = ref([
      { 
        id: 1, 
        title: 'Vue3组合式API实战指南', 
        categoryId: 3, 
        popularity: 0.9, 
        date: new Date(2023, 5, 15),
        excerpt: '本文详细介绍Vue3组合式API的使用方法和最佳实践，帮助开发者快速掌握这一强大特性。',
        tagIds: [1, 4],
        views: 3240,
        comments: 42,
        stars: 156,
        isFeatured: true
      },
      { 
        id: 2, 
        title: 'Java 17新特性详解', 
        categoryId: 2, 
        popularity: 0.8, 
        date: new Date(2023, 4, 22),
        excerpt: '深入解析Java 17带来的新特性和改进，包括密封类、模式匹配和增强型伪随机数生成器等。',
        tagIds: [2, 5],
        views: 2180,
        comments: 28,
        stars: 94,
        isFeatured: false
      },
      { 
        id: 3, 
        title: '微服务架构设计模式', 
        categoryId: 1, 
        popularity: 0.85, 
        date: new Date(2023, 6, 3),
        excerpt: '探讨微服务架构中常见的设计模式，包括API网关、服务发现、断路器等模式的实现和应用场景。',
        tagIds: [3, 5, 6],
        views: 4120,
        comments: 56,
        stars: 203,
        isFeatured: true
      },
      { 
        id: 4, 
        title: 'React vs Vue性能对比', 
        categoryId: 3, 
        popularity: 0.75, 
        date: new Date(2023, 3, 18),
        excerpt: '通过多个真实项目案例，对比React和Vue在不同场景下的性能表现，为技术选型提供参考。',
        tagIds: [1, 4],
        views: 5630,
        comments: 87,
        stars: 245,
        isFeatured: false
      },
      { 
        id: 5, 
        title: 'Spring Boot 3.0迁移指南', 
        categoryId: 2, 
        popularity: 0.7, 
        date: new Date(2023, 7, 9),
        excerpt: '详细介绍从Spring Boot 2.x迁移到3.0的步骤、注意事项和最佳实践，帮助团队平稳升级。',
        tagIds: [2, 5],
        views: 1890,
        comments: 32,
        stars: 118,
        isFeatured: false
      },
      { 
        id: 6, 
        title: '大规模分布式系统设计', 
        categoryId: 1, 
        popularity: 0.95, 
        date: new Date(2023, 2, 27),
        excerpt: '探讨构建高可用、高性能分布式系统的核心原则和实践经验，包括数据一致性、可扩展性等关键问题。',
        tagIds: [3, 5, 8],
        views: 7840,
        comments: 104,
        stars: 312,
        isFeatured: true
      },
      { 
        id: 7, 
        title: 'TypeScript高级类型编程', 
        categoryId: 3, 
        popularity: 0.8, 
        date: new Date(2023, 6, 14),
        excerpt: '深入TypeScript类型系统，讲解条件类型、映射类型、类型推断等高级特性，提升代码类型安全性。',
        tagIds: [1, 4],
        views: 2760,
        comments: 38,
        stars: 142,
        isFeatured: false
      },
      { 
        id: 8, 
        title: 'JVM调优实战案例', 
        categoryId: 2, 
        popularity: 0.75, 
        date: new Date(2023, 5, 8),
        excerpt: '通过真实案例分析JVM性能问题的排查和优化过程，包括内存泄漏、GC问题和线程优化等方面。',
        tagIds: [2, 5],
        views: 3450,
        comments: 47,
        stars: 168,
        isFeatured: false
      },
      { 
        id: 9, 
        title: '容器化部署最佳实践', 
        categoryId: 1, 
        popularity: 0.85, 
        date: new Date(2023, 4, 19),
        excerpt: '分享使用Docker和Kubernetes进行应用容器化部署的最佳实践，包括镜像优化、资源管理等内容。',
        tagIds: [3, 6],
        views: 4230,
        comments: 53,
        stars: 197,
        isFeatured: false
      },
      { 
        id: 10, 
        title: 'Vue3状态管理方案对比', 
        categoryId: 3, 
        popularity: 0.82, 
        date: new Date(2023, 7, 22),
        excerpt: '对比Vuex、Pinia和组合式API等Vue3状态管理方案的优缺点，帮助开发者选择最适合的方案。',
        tagIds: [1, 4],
        views: 2980,
        comments: 41,
        stars: 163,
        isFeatured: false
      },
      { 
        id: 11, 
        title: 'Java并发编程实战', 
        categoryId: 2, 
        popularity: 0.88, 
        date: new Date(2023, 6, 30),
        excerpt: '深入讲解Java并发编程的核心概念和实践技巧，包括线程池、锁机制和并发集合等内容。',
        tagIds: [2, 5],
        views: 5120,
        comments: 68,
        stars: 234,
        isFeatured: true
      },
      { 
        id: 12, 
        title: '云原生架构演进之路', 
        categoryId: 1, 
        popularity: 0.92, 
        date: new Date(2023, 5, 25),
        excerpt: '分享从传统架构迁移到云原生架构的经验和挑战，包括技术选型、团队转型和成本控制等方面。',
        tagIds: [3, 6],
        views: 6340,
        comments: 82,
        stars: 275,
        isFeatured: true
      }
    ]);

    const tags = ref([
      { id: 1, name: 'JavaScript' },
      { id: 2, name: 'Java' },
      { id: 3, name: '架构' },
      { id: 4, name: '前端' },
      { id: 5, name: '后端' },
      { id: 6, name: '云原生' },
      { id: 7, name: 'AI' },
      { id: 8, name: '数据库' }
    ]);

    const recommendations = ref([
      { id: 1, title: '从Vue到React：框架思维转换', categoryId: 3 },
      { id: 2, title: 'Java与Python协同开发策略', categoryId: 2 },
      { id: 3, title: '全栈工程师成长路径', categoryId: 1 }
    ]);

    const aiPrediction = ref('根据您的浏览历史，我们推荐您阅读《微服务架构设计模式》和《TypeScript高级类型编程》这两篇文章，它们与您的技术兴趣高度相关。');

    // Computed properties
    const currentCategory = computed(() => {
      return categories.value.find(c => c.id === props.categoryId) || categories.value[0];
    });

    const categoryArticles = computed(() => {
      return allArticles.value.filter(article => article.categoryId === currentCategory.value.id);
    });

    const categoryTags = computed(() => {
      // Get all unique tag IDs from the category's articles
      const tagIds = new Set();
      categoryArticles.value.forEach(article => {
        article.tagIds.forEach(id => tagIds.add(id));
      });
      
      // Return the tag objects for these IDs
      return tags.value.filter(tag => tagIds.has(tag.id));
    });

    const categoryPopularity = computed(() => {
      if (categoryArticles.value.length === 0) return 0;
      
      // Calculate average popularity of articles in this category
      const sum = categoryArticles.value.reduce((acc, article) => acc + article.popularity, 0);
      return sum / categoryArticles.value.length;
    });

    const filteredArticles = computed(() => {
      let result = [...categoryArticles.value];
      
      // Apply search filter
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(article => 
          article.title.toLowerCase().includes(query) || 
          article.excerpt.toLowerCase().includes(query)
        );
      }
      
      // Apply time filter
      if (timeFilter.value !== 'all') {
        const now = new Date();
        let monthsAgo;
        
        switch (timeFilter.value) {
          case 'month':
            monthsAgo = 1;
            break;
          case 'quarter':
            monthsAgo = 3;
            break;
          case 'halfyear':
            monthsAgo = 6;
            break;
          case 'year':
            monthsAgo = 12;
            break;
          default:
            monthsAgo = 0;
        }
        
        if (monthsAgo > 0) {
          const cutoffDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, now.getDate());
          result = result.filter(article => article.date >= cutoffDate);
        }
      }
      
      // Apply tag filter
      if (selectedTags.value.length > 0) {
        result = result.filter(article => 
          article.tagIds.some(tagId => selectedTags.value.includes(tagId))
        );
      }
      
      // Apply sorting
      switch (sortBy.value) {
        case 'date-desc':
          result.sort((a, b) => b.date - a.date);
          break;
        case 'date-asc':
          result.sort((a, b) => a.date - b.date);
          break;
        case 'popularity-desc':
          result.sort((a, b) => b.popularity - a.popularity);
          break;
        case 'title-asc':
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;
      }
      
      return result;
    });

    const paginatedArticles = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage.value;
      return filteredArticles.value.slice(startIndex, startIndex + itemsPerPage.value);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredArticles.value.length / itemsPerPage.value);
    });

    const relatedCategories = computed(() => {
      // Return all categories except the current one
      return categories.value.filter(c => c.id !== currentCategory.value.id);
    });

    // Methods
    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
      document.body.classList.toggle('dark-mode', isDarkMode.value);
    };

    const toggleRecommendations = () => {
      showRecommendations.value = !showRecommendations.value;
    };

    const toggleTag = (tagId) => {
      if (selectedTags.value.includes(tagId)) {
        selectedTags.value = selectedTags.value.filter(id => id !== tagId);
      } else {
        selectedTags.value.push(tagId);
      }
      // Reset to first page when filters change
      currentPage.value = 1;
    };

    const resetFilters = () => {
      searchQuery.value = '';
      timeFilter.value = 'all';
      sortBy.value = 'date-desc';
      selectedTags.value = [];
      currentPage.value = 1;
    };

    const formatDate = (date) => {
      return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' });
    };

    const getTagName = (tagId) => {
      const tag = tags.value.find(t => t.id === tagId);
      return tag ? tag.name : '';
    };

    const getCategoryColor = (type) => {
      const colors = {
        tech: '#4287f5',
        java: '#f58742',
        frontend: '#42f5b3',
        ai: '#b342f5',
        database: '#f54242',
        cloud: '#42a5f5'
      };
      return colors[type] || '#ffffff';
    };

    const getUpdateFrequencyText = (frequency) => {
      if (frequency >= 0.8) return '非常活跃';
      if (frequency >= 0.6) return '活跃';
      if (frequency >= 0.4) return '一般';
      return '较少更新';
    };

    const getPopularityText = (popularity) => {
      if (popularity >= 0.9) return '极高';
      if (popularity >= 0.7) return '很高';
      if (popularity >= 0.5) return '中等';
      return '一般';
    };

    const getCategoryDescription = (type) => {
      const descriptions = {
        tech: '这里汇集了最前沿的技术趋势和深度解析，帮助开发者把握技术发展方向，提升技术视野。',
        java: '专注于Java生态系统的一切，从核心语言特性到框架应用，这里是Java开发者的知识宝库。',
        frontend: '探索前端技术的无限可能，这里有最新的框架评测、性能优化技巧和用户体验设计思考。',
        ai: '人工智能正在改变世界，这个领域汇集了机器学习、深度学习和AI应用的前沿研究和实践。',
        database: '数据是现代应用的核心，这里深入探讨各类数据库技术、数据建模和高性能数据处理方案。',
        cloud: '云计算正在重塑IT基础设施，这里分享云原生架构、容器化部署和微服务设计的最佳实践。'
      };
      return descriptions[type] || '探索这个知识领域的精彩内容，发现更多技术洞见和实践经验。';
    };

    const goBack = () => {
      // In a real app, this would navigate back to the main page
      console.log('Navigate back to main page');
    };

    const navigateToCategory = (categoryId) => {
      // In a real app, this would navigate to the selected category
      console.log(`Navigate to category ${categoryId}`);
    };

    // Initialize banner particles
    const initBannerParticles = () => {
      if (!bannerParticles.value) return;
      
      const canvas = document.createElement('canvas');
      canvas.width = bannerParticles.value.clientWidth;
      canvas.height = bannerParticles.value.clientHeight;
      bannerParticles.value.appendChild(canvas);
      
      const ctx = canvas.getContext('2d');
      const particles = [];
      
      // Create particles based on category type
      const particleCount = 100;
      const categoryColor = getCategoryColor(currentCategory.value.type);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          color: categoryColor,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.5 + 0.5
        });
      }
      
      // Animation function
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
          // Update position
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          
          // Wrap around edges
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;
          
          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${hexToRgb(particle.color)}, ${particle.opacity})`;
          ctx.fill();
        });
        
        requestAnimationFrame(animate);
      };
      
      animate();
    };

    // Helper function to convert hex color to rgb
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
        '255, 255, 255';
    };

    // Lifecycle hooks
    onMounted(() => {
      // Set dark mode by default
      document.body.classList.add('dark-mode');
      
      // Initialize banner particles
      setTimeout(initBannerParticles, 100);
    });

    // Reset page when category changes
    watch(() => props.categoryId, () => {
      resetFilters();
    });

    return {
      isDarkMode,
      showRecommendations,
      searchQuery,
      timeFilter,
      sortBy,
      selectedTags,
      currentPage,
      bannerParticles,
      currentCategory,
      categoryArticles,
      categoryTags,
      categoryPopularity,
      filteredArticles,
      paginatedArticles,
      totalPages,
      relatedCategories,
      recommendations,
      aiPrediction,
      toggleDarkMode,
      toggleRecommendations,
      toggleTag,
      resetFilters,
      formatDate,
      getTagName,
      getCategoryColor,
      getUpdateFrequencyText,
      getPopularityText,
      getCategoryDescription,
      goBack,
      navigateToCategory
    };
  }
};
</script>

<style scoped>
/* Import space font */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Rajdhani:wght@300;400;500;600;700&display=swap');

:root {
  --font-heading: 'Orbitron', sans-serif;
  --font-body: 'Rajdhani', sans-serif;
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --glow-intensity: 0.8;
}

/* Category Detail Specific Styles */
.category-detail {
  min-height: 100vh;
  background-color: var(--color-space-bg);
  color: var(--color-space-text);
  font-family: var(--font-body);
  letter-spacing: 0.02em;
}

/* Banner Styles */
.category-banner {
  position: relative;
  height: 280px;
  padding: 2.5rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.category-banner.tech {
  background: linear-gradient(135deg, rgba(66, 135, 245, 0.3), rgba(66, 135, 245, 0.05));
  border-bottom: 2px solid var(--color-tech);
}

.category-banner.java {
  background: linear-gradient(135deg, rgba(245, 135, 66, 0.3), rgba(245, 135, 66, 0.05));
  border-bottom: 2px solid var(--color-java);
}

.category-banner.frontend {
  background: linear-gradient(135deg, rgba(66, 245, 179, 0.3), rgba(66, 245, 179, 0.05));
  border-bottom: 2px solid var(--color-frontend);
}

.category-banner.ai {
  background: linear-gradient(135deg, rgba(179, 66, 245, 0.3), rgba(179, 66, 245, 0.05));
  border-bottom: 2px solid var(--color-ai);
}

.category-banner.database {
  background: linear-gradient(135deg, rgba(245, 66, 66, 0.3), rgba(245, 66, 66, 0.05));
  border-bottom: 2px solid var(--color-database);
}

.category-banner.cloud {
  background: linear-gradient(135deg, rgba(66, 165, 245, 0.3), rgba(66, 165, 245, 0.05));
  border-bottom: 2px solid var(--color-cloud);
}

.banner-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.banner-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.banner-content h1 {
  font-family: var(--font-heading);
  font-size: 2.8rem;
  margin-bottom: 1.2rem;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  letter-spacing: 0.05em;
  font-weight: 700;
  background: linear-gradient(to right, #ffffff, #a0a0ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.category-stats {
  display: flex;
  gap: 3rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.stat-item::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.category-description {
  font-size: 1.1rem;
  line-height: 1.7;
  max-width: 700px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

/* Content Styles */
.category-content {
  padding: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.filter-section {
  background-color: var(--color-panel-bg);
  border-radius: 12px;
  padding: 1.8rem;
  margin-bottom: 2.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.search-box {
  display: flex;
  margin-bottom: 1.8rem;
  gap: 0.5rem;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.9rem 1.2rem 0.9rem 2.8rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--color-space-text);
  font-family: var(--font-body);
  font-size: 1rem;
  transition: var(--transition-smooth);
  letter-spacing: 0.03em;
}

.search-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 15px rgba(66, 135, 245, 0.3);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.6;
  pointer-events: none;
}

.search-button {
  position: relative;
  padding: 0.9rem 1.8rem;
  background-color: var(--color-tech);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-family: var(--font-heading);
  font-weight: 500;
  letter-spacing: 0.05em;
  overflow: hidden;
  transition: var(--transition-smooth);
}

.search-button:hover {
  background-color: rgba(66, 135, 245, 0.9);
  transform: translateY(-2px);
}

.search-button:active {
  transform: translateY(1px);
}

.button-text {
  position: relative;
  z-index: 2;
}

.button-glow {
  position: absolute;
  top: -20%;
  left: -10%;
  width: 120%;
  height: 140%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.search-button:hover .button-glow {
  opacity: 0.2;
}

.filter-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.8rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  margin-bottom: 0.8rem;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.03em;
  color: rgba(255, 255, 255, 0.9);
}

.select-wrapper {
  position: relative;
}

.filter-select {
  width: 100%;
  padding: 0.8rem 2.5rem 0.8rem 1rem;
  background-color: rgba(15, 15, 35, 0.95);
  border: 1px solid rgba(100, 100, 255, 0.15);
  border-radius: 12px;
  color: rgba(200, 200, 255, 0.8);
  font-family: var(--font-body);
  font-size: 0.95rem;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 8px rgba(66, 135, 245, 0.05);
}

.filter-select:hover {
  background-color: rgba(20, 20, 45, 0.98);
  border-color: rgba(100, 100, 255, 0.25);
  box-shadow: 0 0 12px rgba(66, 135, 245, 0.1);
  transform: translateY(-1px);
}

.filter-select:focus {
  outline: none;
  background-color: rgba(25, 25, 50, 0.98);
  border-color: rgba(100, 100, 255, 0.35);
  box-shadow: 0 0 15px rgba(66, 135, 245, 0.15);
}

.filter-select option {
  background-color: rgba(12, 12, 30, 0.98);
  color: rgba(200, 200, 255, 0.8);
  padding: 12px;
  font-size: 0.95rem;
}

.filter-select option:hover {
  background-color: rgba(25, 25, 50, 0.98);
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  color: rgba(100, 100, 255, 0.7);
  pointer-events: none;
  transition: all 0.3s ease;
}

.select-wrapper:hover .select-arrow {
  color: rgba(100, 100, 255, 1);
  transform: translateY(-50%) scale(1.1);
}

.filter-group.tags {
  grid-column: 1 / -1;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.tag-item {
  position: relative;
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  cursor: pointer;
  transition: var(--transition-smooth);
  font-size: 0.9rem;
  letter-spacing: 0.03em;
  overflow: hidden;
}

.tag-item:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.tag-item.selected {
  background-color: var(--color-tech);
  box-shadow: 0 0 15px rgba(66, 135, 245, 0.5);
  color: white;
}

.tag-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%);
  animation: pulse 2s infinite;
  pointer-events: none;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.2;
  }
  100% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.5;
  }
}

.section-title {
  margin-bottom: 1.8rem;
  font-size: 2rem;
  display: flex;
  align-items: center;
  font-family: var(--font-heading);
  letter-spacing: 0.05em;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.article-count {
  font-size: 1rem;
  opacity: 0.7;
  margin-left: 0.8rem;
  font-family: var(--font-body);
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.8rem;
  margin-bottom: 2.5rem;
}

.article-card {
  position: relative;
  background-color: var(--color-card-bg);
  border-radius: 12px;
  overflow: hidden;
  transition: var(--transition-smooth);
  height: 100%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}

.article-card.featured {
  border: 1px solid rgba(245, 215, 66, 0.5);
  box-shadow: 0 4px 20px rgba(245, 215, 66, 0.2);
}

.article-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background-color: var(--glow-color);
  box-shadow: 0 0 15px var(--glow-color);
}

.article-content {
  padding: 1.8rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}

.article-date {
  font-size: 0.9rem;
  opacity: 0.7;
  letter-spacing: 0.03em;
}

.featured-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background-color: rgba(245, 215, 66, 0.2);
  color: #f5d742;
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.badge-star {
  font-size: 0.9rem;
}

.article-title {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  line-height: 1.4;
  font-family: var(--font-heading);
  letter-spacing: 0.03em;
  color: #ffffff;
}

.article-excerpt {
  font-size: 1rem;
  line-height: 1.7;
  opacity: 0.85;
  margin-bottom: 1.8rem;
  flex: 1;
  letter-spacing: 0.02em;
}

.article-footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.article-tag {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  font-size: 0.8rem;
  letter-spacing: 0.03em;
  transition: var(--transition-smooth);
}

.article-tag:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.article-stats {
  display: flex;
  gap: 1.2rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  opacity: 0.7;
  transition: var(--transition-smooth);
}

.stat:hover {
  opacity: 1;
}

.icon {
  font-size: 0.9rem;
}

.no-articles {
  background-color: var(--color-card-bg);
  border-radius: 12px;
  padding: 3.5rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.empty-animation {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  background: conic-gradient(var(--color-tech), var(--color-frontend), var(--color-java), var(--color-tech));
  animation: rotate 3s linear infinite;
  box-shadow: 0 0 30px rgba(66, 135, 245, 0.3);
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.reset-button {
  position: relative;
  margin-top: 2rem;
  padding: 0.8rem 1.8rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: var(--color-space-text);
  cursor: pointer;
  font-family: var(--font-heading);
  font-weight: 500;
  letter-spacing: 0.05em;
  transition: var(--transition-smooth);
  overflow: hidden;
}

.reset-button:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.reset-button:active {
  transform: translateY(1px);
}

.reset-button:hover .button-glow {
  opacity: 0.2;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2.5rem;
}

.page-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: var(--color-space-text);
  cursor: pointer;
  font-family: var(--font-heading);
  font-weight: 500;
  letter-spacing: 0.03em;
  transition: var(--transition-smooth);
}

.page-button:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.page-button:active:not(:disabled) {
  transform: translateY(1px);
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-arrow {
  font-size: 0.8rem;
}

.prev-button .page-arrow {
  margin-right: 0.2rem;
}

.next-button .page-arrow {
  margin-left: 0.2rem;
}

.page-info {
  font-size: 1rem;
  letter-spacing: 0.05em;
  font-family: var(--font-heading);
}

/* Related Categories */
.related-categories {
  margin-top: 4rem;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.8rem;
}

.related-card {
  position: relative;
  height: 130px;
  background-color: var(--color-card-bg);
  border-radius: 12px;
  overflow: hidden;
  padding: 1.8rem;
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.related-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}

.related-card.tech {
  border-left: 3px solid var(--color-tech);
}

.related-card.java {
  border-left: 3px solid var(--color-java);
}

.related-card.frontend {
  border-left: 3px solid var(--color-frontend);
}

.related-card.ai {
  border-left: 3px solid var(--color-ai);
}

.related-card.database {
  border-left: 3px solid var(--color-database);
}

.related-card.cloud {
  border-left: 3px solid var(--color-cloud);
}

.related-particle-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.related-card h3 {
  position: relative;
  z-index: 2;
  font-size: 1.4rem;
  margin-bottom: 0.7rem;
  font-family: var(--font-heading);
  letter-spacing: 0.03em;
  color: #ffffff;
}

.related-card .article-count {
  position: relative;
  z-index: 2;
  font-size: 0.9rem;
  opacity: 0.7;
  letter-spacing: 0.02em;
}

.card-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.related-card:hover .card-hover-effect {
  opacity: 1;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .category-banner {
    height: auto;
    padding: 1.8rem;
  }
  
  .banner-content h1 {
    font-size: 2.2rem;
  }
  
  .category-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .stat-item {
    flex-direction: row;
    gap: 1rem;
    align-items: center;
  }
  
  .stat-item::after {
    display: none;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .category-content {
    padding: 1.5rem;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-options {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
}

/* Animation for tag selection */
@keyframes tagSelect {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.tag-item.selected {
  animation: tagSelect 0.3s ease;
}
.home-portal {
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  padding: 3px;
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(88, 161, 255, 0.5);
  border-radius: 20px;
  color: #58a1ff;
  font-family: 'Arial', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  backdrop-filter: blur(5px);
  box-shadow: 0 0 15px rgba(88, 161, 255, 0.3);
}

.home-portal:hover {
  background: rgba(0, 0, 0, 0.8);
  border-color: #58a1ff;
  box-shadow: 0 0 20px rgba(88, 161, 255, 0.5);
  transform: scale(1.05);
}

.portal-icon {
  width: 20px;
  height: 20px;
  border: 2px solid #58a1ff;
  border-radius: 50%;
  position: relative;
}



.portal-text {
  font-size: 14px;
  letter-spacing: 1px;
  text-shadow: 0 0 5px rgba(88, 161, 255, 0.5);
}

.home-portal:active {
  transform: scale(0.95);
}
</style>