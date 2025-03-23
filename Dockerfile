# 构建阶段
FROM node:20-alpine AS build-stage
WORKDIR /app
# 先复制package.json和package-lock.json
COPY package*.json ./
# 安装依赖前先安装缺失的rollup依赖
RUN npm install @rollup/rollup-linux-x64-musl
RUN npm ci
# 复制其余源代码
COPY . .
# 构建应用 - 移除不支持的 --docs 参数
RUN npm run build

# 生产阶段
FROM nginx:alpine AS production-stage
# 从构建阶段复制构建产物 - 保持docs目录路径不变
COPY --from=build-stage /app/docs /usr/share/nginx/html
# 设置正确的文件权限
RUN chmod -R 755 /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]