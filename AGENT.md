# AGENT.md

本文档为处理Sink项目的AI助手提供指导。

## 项目概述

Sink是一个基于Nuxt 3和Cloudflare Workers构建的URL缩短服务。它提供数据分析、实时跟踪和现代化的Web界面。

## 核心技术

- **前端**：Nuxt 3、Vue 3、TypeScript、Tailwind CSS、shadcn/ui
- **后端**：Cloudflare Workers、H3（Nitro）
- **数据库**：Cloudflare KV
- **分析工具**：Cloudflare Analytics Engine
- **部署方式**：Cloudflare Pages/Workers

## 项目结构

```txt
Sink/
├── app/                     # Nuxt 3应用程序
│   ├── components/          # Vue组件
│   ├── pages/              # 文件路由
│   ├── layouts/            # 布局组件
│   ├── utils/              # 工具函数
│   └── middleware/         # 路由中间件
├── server/                  # 服务端API
│   ├── api/                # API端点
│   ├── middleware/         # 服务端中间件
│   └── utils/              # 服务端工具
├── public/                 # 静态资源
├── schemas/                # TypeScript类型定义
├── tests/                  # 测试文件
└── docs/                   # 文档
```

## 开发命令

- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建生产版本
- `pnpm preview` - 预览生产构建
- `pnpm test` - 运行测试
- `pnpm lint` - 运行ESLint检查

## 核心规范

### 代码风格

- 所有新代码使用TypeScript
- 遵循Vue 3组合式API模式
- 组件名称使用PascalCase（帕斯卡命名法）
- 变量和函数使用camelCase（驼峰命名法）
- CSS类使用kebab-case（短横线命名法）

### API结构

- RESTful端点位于`/server/api/`目录
- 在`/schemas/`中使用Zod进行 schema 验证
- 实现完善的错误处理
- 使用Cloudflare环境变量进行配置

### 数据库

- 使用Cloudflare KV

### 测试

- 使用Vitest进行单元测试
- 测试文件应与源文件放在同一目录
- 使用`/tests/utils.ts`中的现有测试工具

## 环境变量

需要注意的关键环境变量：

- `NUXT_CF_ACCOUNT_ID` - Cloudflare账户ID
- `NUXT_CF_API_TOKEN` - Cloudflare API令牌
- `NUXT_DATASET` - 分析引擎ID
- `NUXT_SITE_TOKEN` - 用于管理的站点令牌

## 常见任务

### 添加新API端点

1. 在`/server/api/`中创建带有适当HTTP方法的文件
2. 在`/schemas/`中添加Zod schema验证
3. 在`/tests/api/`中添加测试
4. 必要时更新文档

### 添加新组件

1. 使用`/app/components/ui/`中的现有UI组件
2. 遵循已有的组件模式
3. 为props添加TypeScript接口
4. 适当时考虑添加到storybook

## 安全指南

- 切勿提交密钥或API密钥
- 敏感配置使用环境变量
- 用Zod schema验证所有用户输入
- 在API端点上实现速率限制
- 遵循OWASP Web安全指南

## 性能考量

- 在适当情况下使用Cloudflare的边缘缓存
- 通过动态导入最小化包体积
- 优化图像和资源
- 使用现有分析工具进行监控

## 故障排除

- 查看Cloudflare控制台中的worker日志
- 使用`wrangler tail`查看实时日志
- 验证环境变量是否正确设置

## 部署

-  staging环境：推送到`main`分支时自动部署
- 生产环境：通过Cloudflare控制台手动触发
- 使用`wrangler deploy`进行手动部署
