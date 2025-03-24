### 友链申请规则

感谢你对我们网站的支持！为了保持友链的质量和一致性，欢迎你通过提交 Pull Request（PR）的方式向我们申请友链。请遵循以下规则：

#### 1. 友链要求
- **个人/团队网站**：我们只接受博客、技术站点或有独特内容的个人/团队网站申请友链，不接受纯商业推广、无内容的站点。
- **内容健康**：网站内容需健康、积极，不能涉及违法、违规内容。
- **网站活跃**：申请者的网站需保持一定的活跃度（最近三个月内有更新）。
- **外链互换**：申请友链前，请先将我们的网站加入你的友链列表。
下述是本人的网站示例（点击展开）：
<details>
<summary>友链示例</summary>

```yaml
- name: EastWind
  descr: 东风不与周郎便
  avatar: https://github.com/WindyDante.png
  url: https://1wind.cn/
```
</details>


#### 2. 申请步骤
1. **Fork 项目**：请先 fork 本项目。
2. **克隆项目**: 克隆你 fork 的项目到本地。
3. **编辑 YAML 文件**：在项目的 `public/friends.yaml` 文件中，添加你的站点信息，格式如下：
   ```yaml
   - name: "你的站点名称"
     url: "https://你的站点链接"
     descr: "简短的站点描述，推荐 30 字以内"
     avatar: "https://你的站点头像"
   ```
4. **推送仓库**: 将修改后的文件推送到你的 fork 仓库。
5. **提交 Pull Request**：将修改后的文件提交 PR。PR 提交时，请确保填写友链申请的标题，内容包含你的站点链接和说明。你需要将 PR 提交到 `master` 分支。

#### 3. 审核与通过
- **审核时间**：我们将在 3 个工作日内审核你的申请，并对不符合要求的 PR 提出修改建议。
- **通过标准**：我们会根据站点的内容质量、活跃度等因素进行审核。审核通过后，你的站点将被添加到我们的友链列表中。

#### 4. 更新与维护
- 如果你的站点链接或其他信息有变动，请及时提交 PR 进行更新。
- 长期不活跃或失效的站点将会被移除友链列表。

#### 5. Docker部署博客

##### 方式一：Docker Run运行
```bash
# 拉取最新镜像
docker pull eastwind996/blog:0.0.3

# 运行容器（端口映射可根据需要调整）
docker run -d -p 2345:80 --name blog eastwind996/blog:0.0.3

# 查看运行日志
docker logs -f blog
```

##### 方式二：Docker Compose部署
```bash
# 使用compose文件启动（默认使用构建好的镜像）
docker-compose up -d

# 更新镜像版本时（修改docker-compose.yml中的image版本号后）：
docker-compose down
docker-compose pull
docker-compose up -d
```

##### 镜像版本管理
- 最新稳定版：`eastwind996/blog:0.0.3`
- 查看所有可用版本：
```bash
docker search eastwind996/blog --filter "is-official=true"
```
- 更新已部署版本：
```bash
# 停止并删除旧容器
docker stop blog && docker rm blog

# 拉取指定版本（示例为0.0.3）
docker pull eastwind996/blog:0.0.3

# 使用新镜像启动容器
docker run -d -p 2345:80 --name blog eastwind996/blog:0.0.3
```

