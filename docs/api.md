# Sink API

Sink 提供了一个完整的 RESTful API 用于管理短链接。完整的 API 文档可通过 OpenAPI 获得。

## OpenAPI 文档

- **OpenAPI JSON**：`/_docs/openapi.json`
- **Scalar UI**：`/_docs/scalar`
- **Swagger UI**：`/_docs/swagger`

访问你的 Sink 实例 `https://your-domain/_docs/scalar` 获取交互式 API 文档。

## 认证

所有 API 端点都需要通过 `Authorization` 请求头中的 Bearer 令牌进行认证：

```http
Authorization: Bearer YOUR_SITE_TOKEN
```

该令牌与你在环境变量中配置的 `NUXT_SITE_TOKEN` 相同。

## API 端点

### 链接

| 方法    | 端点                 | 描述                         |
| ------- | -------------------- | ---------------------------- |
| `POST`  | `/api/link/create`   | 创建新的短链接               |
| `PUT`   | `/api/link/edit`     | 更新已有的链接               |
| `POST`  | `/api/link/upsert`   | 通过 slug 创建或更新链接     |
| `POST`  | `/api/link/delete`   | 删除链接                     |
| `GET`   | `/api/link/query`    | 通过 slug 获取链接           |
| `GET`   | `/api/link/search`   | 搜索链接                     |
| `GET`   | `/api/link/list`     | 列出所有链接（分页）         |
| `GET`   | `/api/link/export`   | 导出所有链接为分页 JSON      |
| `POST`  | `/api/link/import`   | 从导出的 JSON 中导入链接     |
| `GET`   | `/api/link/ai`       | 生成 AI 驱动的 slug 建议     |
| `GET`   | `/api/link/og-ai`    | 生成 AI 驱动的 OpenGraph 元数据 |
| `POST`  | `/api/upload/image`  | 上传 OpenGraph 图片至 R2     |
| `POST`  | `/api/backup`        | 手动触发 KV 备份至 R2        |

### 分析

| 方法   | 端点                  | 描述                       |
| ------ | --------------------- | -------------------------- |
| `GET`  | `/api/stats/counters` | 获取分析计数器             |
| `GET`  | `/api/stats/metrics`  | 按维度获取详细指标         |
| `GET`  | `/api/stats/views`    | 获取时间序列访问次数       |
| `GET`  | `/api/stats/heatmap`  | 获取热力图数据             |
| `GET`  | `/api/stats/export`   | 导出访问分析为 CSV         |
| `GET`  | `/api/logs/events`    | 获取实时事件日志           |
| `GET`  | `/api/logs/locations` | 获取最近的访问位置         |

## 示例：创建短链接

```http
POST /api/link/create
Authorization: Bearer SinkCool
Content-Type: application/json

{
  "url": "https://github.com/miantiao-me/Sink",
  "slug": "sink",
  "comment": "GitHub repo",
  "expiration": 1767225599,
  "apple": "https://apps.apple.com/app/id6745417598",
  "google": "https://play.google.com/store/apps/details?id=com.example",
  "geo": {
    "US": "https://example.com/us",
    "JP": "https://example.com/jp"
  },
  "title": "Sink - Link Shortener",
  "description": "A simple, speedy, secure link shortener",
  "image": "/_assets/images/sink/cover.webp",
  "password": "correct-horse-battery-staple",
  "unsafe": false,
  "redirectWithQuery": true
}
```

### 响应

```json
{
  "link": {
    "id": "01jxyz...",
    "url": "https://github.com/miantiao-me/Sink",
    "slug": "sink",
    "comment": "GitHub repo",
    "createdAt": 1718119809,
    "updatedAt": 1718119809
  }
}
```

## 请求体字段

| 字段                | 类型      | 必需 | 描述                                                         |
| ------------------- | --------- | ---- | ------------------------------------------------------------ |
| `url`               | `string`  | ✅   | 目标 URL（最长 2048 个字符）                                  |
| `slug`              | `string`  | ❌   | 自定义 slug（若省略则自动生成）                               |
| `comment`           | `string`  | ❌   | 链接的内部备注                                               |
| `expiration`        | `number`  | ❌   | 以秒为单位的 Unix 时间戳；必须是未来的时间                      |
| `apple`             | `string`  | ❌   | Apple 设备跳转 URL                                            |
| `google`            | `string`  | ❌   | Android/Google Play 跳转 URL                                  |
| `geo`               | `object`  | ❌   | 按国家/地区路由的映射，例如 `{ "US": "https://..." }`         |
| `title`             | `string`  | ❌   | OpenGraph 标题                                               |
| `description`       | `string`  | ❌   | OpenGraph 描述                                               |
| `image`             | `string`  | ❌   | OpenGraph 图片 URL 或已上传的资源路径                         |
| `cloaking`          | `boolean` | ❌   | 启用链接伪装（用短链接掩盖目标 URL）                          |
| `redirectWithQuery` | `boolean` | ❌   | 将查询参数附加到目标 URL（覆盖全局设置）                      |
| `password`          | `string`  | ❌   | 链接的密码保护（存储时已哈希处理）                             |
| `unsafe`            | `boolean` | ❌   | 将链接标记为不安全（跳转前显示警告页面）                       |

### 路由行为

- 地区路由使用 Cloudflare 的 `request.cf.country` 值和两位 ISO 国家/地区代码。键名会统一转换为大写。
- 当访问者匹配到 Apple 或 Android 用户代理时，设备路由会优先于默认或地区路由的目标地址。
- 如果启用了 `redirectWithQuery`，短链接上的查询参数会附加到最终目标 URL 之后。

### 密码保护和危险链接

受密码保护的链接会向浏览器访问者展示一个 HTML 密码表单。API 或脚本客户端在请求短链接时可以传递 `x-link-password`。危险链接在跳转前需要确认；脚本客户端可以在验证目标地址后传递 `x-link-confirm: true`。

### 示例：使用 AI 生成 OpenGraph 元数据

```http
GET /api/link/og-ai?url=https%3A%2F%2Fgithub.com%2Fmiantiao-me%2FSink&locale=en-US
Authorization: Bearer SinkCool
```

```json
{
  "title": "Sink",
  "description": "A simple, speedy, secure link shortener with analytics on Cloudflare."
}
```

### 示例：导出访问分析为 CSV

```http
GET /api/stats/export?startAt=1717200000&endAt=1719791999&slug=sink
Authorization: Bearer SinkCool
```

响应类型为 `text/csv`，包含以下列：

```csv
slug,url,viewer,views,referer
sink,https://github.com/miantiao-me/Sink,123,456,12
```

## CORS

如需为 API 端点启用 CORS，请在构建时设置 `NUXT_API_CORS=true`。

