
---
name: sink
description: |
  通过 OpenAPI 进行 Sink 短链接 API 操作。适用于管理短链接：创建、查询、更新、删除、列出、导入、导出链接，配置智能路由、密码保护、不安全链接警告以及分析数据导出。还涵盖 AI 驱动的 slug 和 OpenGraph 元数据生成。
  触发词："create short link", "shorten URL", "delete link", "edit link", "list links", "export links", "import links", "link analytics", "export analytics", "AI slug", "AI OpenGraph", "geo routing"。
---

# Sink API

Sink 是一个运行在 Cloudflare 上的链接缩短工具。通过 REST API 管理链接。

## 认证

所有端点都需要 Bearer 令牌认证：

```http
Authorization: Bearer YOUR_SITE_TOKEN
```

令牌 = `NUXT_SITE_TOKEN` 环境变量。

## 基础 URL

```
https://your-sink-domain
```

## API 参考

### 创建链接

```http
POST /api/link/create
Content-Type: application/json

{
  "url": "https://example.com/long-url",
  "slug": "custom-slug",
  "comment": "可选备注",
  "expiration": 1735689599,
  "apple": "https://apps.apple.com/app/id123",
  "google": "https://play.google.com/store/apps/details?id=com.example",
  "geo": {
    "US": "https://example.com/us"
  },
  "title": "示例标题",
  "description": "示例社交预览描述",
  "password": "可选密码",
  "redirectWithQuery": true
}
```

**必填**：`url`
**可选**：`slug`（省略则自动生成）、`comment`、`expiration`（Unix 时间戳）、`apple`（Apple 设备重定向）、`google`（Android 重定向）、`geo`（按国家/地区路由的映射）、`password`、`unsafe`、`title`、`description`、`image`、`cloaking`、`redirectWithQuery`

> 如果配置了 `NUXT_SAFE_BROWSING_DOH` 且未显式设置 `unsafe`，服务端会通过 DoH 自动检测并自动标记不安全链接。

**响应**（201）：

```json
{
  "link": {
    "id": "abc123",
    "url": "https://example.com/long-url",
    "slug": "custom-slug",
    "createdAt": 1718119809,
    "updatedAt": 1718119809
  },
  "shortLink": "https://your-domain/custom-slug"
}
```

**错误**：409（slug 已存在）

### 查询链接

```http
GET /api/link/query?slug=custom-slug
```

**响应**（200）：

```json
{
  "id": "abc123",
  "url": "https://example.com",
  "slug": "custom-slug",
  "createdAt": 1718119809,
  "updatedAt": 1718119809
}
```

**错误**：404（未找到）

### 编辑链接

```http
PUT /api/link/edit
Content-Type: application/json

{
  "slug": "existing-slug",
  "url": "https://new-url.com",
  "comment": "已更新的备注"
}
```

**必填**：`slug`（标识要编辑的链接）、`url`
**可选**：其他需要更新的字段

**响应**（201）：与创建相同

**错误**：404（未找到）

### 删除链接

```http
POST /api/link/delete
Content-Type: application/json

{
  "slug": "slug-to-delete"
}
```

**响应**：200（空响应体）

### 列出链接

```http
GET /api/link/list?limit=20&cursor=abc123
```

**参数**：

- `limit`：最大 1024，默认 20
- `cursor`：来自上次响应的分页游标

**响应**：

```json
{
  "keys": [],
  "list_complete": false,
  "cursor": "next-cursor"
}
```

### 导出链接

```http
GET /api/link/export
```

**响应**：

```json
{
  "version": "1.0",
  "exportedAt": "2024-01-01T00:00:00Z",
  "count": 100,
  "links": [],
  "list_complete": true
}
```

### 导入链接

```http
POST /api/link/import
Content-Type: application/json

{
  "links": [
    {"url": "https://example1.com", "slug": "ex1"},
    {"url": "https://example2.com", "slug": "ex2"}
  ]
}
```

**响应**：导入的链接数组

### AI Slug 生成

```http
GET /api/link/ai?url=https://example.com/article
```

服务端可使用 URL 和提取的页面内容生成可读的 slug。

**响应**：

```json
{
  "slug": "ai-generated-slug"
}
```

### AI OpenGraph 元数据生成

```http
GET /api/link/og-ai?url=https://example.com/article&locale=en-US
```

根据 URL 和提取的页面内容生成本地化的 OpenGraph 标题和描述。

**响应**：

```json
{
  "title": "示例文章",
  "description": "简洁的社交预览描述。"
}
```

### 验证令牌

```http
GET /api/verify
```

验证站点令牌是否有效。

**响应**（200）：

```json
{
  "name": "Sink",
  "url": "https://sink.cool"
}
```

**错误**：401（令牌无效）

## 链接字段

| 字段                | 类型    | 必填 | 描述                                                                     |
| ------------------- | ------- | ---- | ------------------------------------------------------------------------ |
| `url`               | string  | 是   | 目标 URL（最大 2048）                                                    |
| `slug`              | string  | 否   | 自定义 slug（自动生成）                                                  |
| `comment`           | string  | 否   | 内部备注                                                                 |
| `expiration`        | number  | 否   | Unix 时间戳                                                              |
| `apple`             | string  | 否   | iOS/macOS 重定向 URL                                                     |
| `google`            | string  | 否   | Android 重定向 URL                                                       |
| `geo`               | object  | 否   | 按国家/地区路由的映射，例如 `{ "US": "https://example.com/us" }`         |
| `title`             | string  | 否   | 自定义标题（最大 256）                                                   |
| `description`       | string  | 否   | 自定义描述                                                               |
| `image`             | string  | 否   | 自定义图片路径                                                           |
| `cloaking`          | boolean | 否   | 启用链接伪装                                                             |
| `redirectWithQuery` | boolean | 否   | 将查询参数附加到目标 URL（覆盖全局 `NUXT_REDIRECT_WITH_QUERY`）          |
| `password`          | string  | 否   | 链接的密码保护                                                           |
| `unsafe`            | boolean | 否   | 标记为不安全（重定向前显示警告页面）                                     |

## 分析端点

### 计数器

```http
GET /api/stats/counters
```

### 指标

```http
GET /api/stats/metrics
```

### 访问量

```http
GET /api/stats/views
```

### 热力图

```http
GET /api/stats/heatmap
```

### 导出访问分析

```http
GET /api/stats/export?startAt=1717200000&endAt=1719791999&slug=custom-slug
```

返回 `text/csv`，包含 `slug`、`url`、`viewer`、`views` 和 `referer` 列。

## OpenAPI 文档

- JSON：`/_docs/openapi.json`
- Scalar UI：`/_docs/scalar`
- Swagger UI：`/_docs/swagger`

## cURL 示例

创建链接：

```bash
curl -X POST https://your-domain/api/link/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com/example"}'
```

列出链接：

```bash
curl https://your-domain/api/link/list \
  -H "Authorization: Bearer YOUR_TOKEN"
```

删除链接：

```bash
curl -X POST https://your-domain/api/link/delete \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"slug": "my-slug"}'
```
