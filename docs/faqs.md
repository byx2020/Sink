# 常见问题

## 1. 为什么我无法创建链接？

请检查 Cloudflare KV 绑定，KV 环境变量名应为全大写字母。

<details>
  <summary><b>截图</b></summary>
  <img alt="Cloudflare 中的 KV 绑定设置" src="/docs/images/faqs-kv.png"/>
</details>

## 2. 为什么我无法登录？

请检查 `NUXT_SITE_TOKEN` 是否设置为纯数字，Sink 不支持纯数字令牌，我们认为这不安全。

## 3. 为什么我看不到分析数据？

分析数据需要访问 Cloudflare 的设置：

1. 验证 `NUXT_CF_ACCOUNT_ID` 和 `NUXT_CF_API_TOKEN` 是否配置正确（确保账户 ID 与部署区域 ID 匹配）。
2. 检查 Worker 分析引擎是否已启用。

<details>
  <summary><b>截图</b></summary>
  <img alt="Cloudflare 中的分析引擎绑定设置" src="/docs/images/faqs-Analytics_engine.png"/>
</details>

## 4. 我不想要当前的主页？可以重定向到我的博客吗？

当然可以。请将环境变量 `NUXT_HOME_URL` 设置为你的博客或官方网站地址。

## 5. 使用 NuxtHub 部署后为什么看不到统计数据？

NuxtHub 的 ANALYTICS 指向其数据集，你需要设置 `NUXT_DATASET` 环境变量，使其指向同一数据集。

## 6. 为什么链接总是不区分大小写？

这是 Sink 的一个特性。默认情况下，我们自动将所有链接转换为小写，以避免大小写问题并提高可用性。这确保用户不会因意外的大小写差异而遇到错误。

不过，你可以通过将 `NUXT_CASE_SENSITIVE` 环境变量设置为 `true` 来禁用此功能。

### 当 `NUXT_CASE_SENSITIVE` 为 `true` 时会发生什么？

新生成的链接将区分大小写，将 `MyLink` 和 `mylink` 视为不同。随机生成的 slug 会包含大小写字符，提供更多唯一组合（但对用户不友好，这就是我们默认不区分大小写的原因）。

## 7. 为什么 Metric 列表只显示前 500 条数据？

为了提高查询性能，我们限制了数据量。如果你需要查询更多数据，可以通过 `NUXT_LIST_QUERY_LIMIT` 进行调整。

## 8. 我不想统计机器人或爬虫流量

将 `NUXT_DISABLE_BOT_ACCESS_LOG` 设置为 `true`。

## 9. 什么是链接伪装？

链接伪装通过在浏览器地址栏中显示你的短链接域名来掩盖目标 URL，而不是重定向到目标地址。目标页面会在一个全屏 iframe 中加载。

### 如何启用

在创建或编辑链接时，在**链接设置**部分中开启**启用链接伪装**。

### 限制

- **屏蔽 iframe 的网站**：带有 `X-Frame-Options: DENY` 或 `Content-Security-Policy: frame-ancestors 'none'` 的网站将无法在 iframe 内加载。大多数主流网站（Google、GitHub、Twitter 等）都会屏蔽 iframe 嵌入。
- **需要 HTTPS**：目标 URL 必须使用 HTTPS。混合内容（HTTPS 短链接 → HTTP 目标）会被浏览器阻止。
- **有限的交互**：某些功能，如 OAuth 登录流程、`window.top` 导航和某些支付表单，在 iframe 中可能无法正常工作。
- **设备重定向优先**：如果同时配置了伪装和设备重定向（iOS/Android），则在匹配的设备上，设备重定向将优先。

### 如果目标网站屏蔽了 iframe

如果你能控制目标网站，可以通过添加以下响应头将你的短链接域名加入白名单：

```
Content-Security-Policy: frame-ancestors 'self' your-short-domain.com
```

## 10. 什么是带查询参数重定向？

启用后，短链接 URL 中的查询参数会附加到目标 URL。例如，访问 `https://s.ink/my-link?ref=twitter` 会重定向到 `https://example.com/page?ref=twitter`。

### 按链接与全局

- **全局设置**：设置 `NUXT_REDIRECT_WITH_QUERY=true` 为所有链接默认启用。
- **按链接覆盖**：在创建或编辑链接时，在**链接设置**部分中切换**带查询参数重定向**。这会覆盖该特定链接的全局设置。

如果某个链接没有单独设置，则会回退到全局配置。

## 11. 导入/导出功能是如何工作的？

导入和导出设计在 Cloudflare Workers 的 KV 操作限制（默认每次请求 50 次）内工作。

- **导出**：分批下载链接，自动分页直到完成。
- **导入**：分批上传链接（`NUXT_PUBLIC_KV_BATCH_LIMIT` 的一半，默认 25），因为每个链接需要 2 次 KV 操作（检查是否存在 + 写入）。
- **过期链接**：按原样导入，以支持迁移场景。
- **重复的 slug**：导入时跳过（保留现有链接）。
- **验证**：所有链接在导入开始前都会根据模式进行验证。
- **密码**：导出的密码值会被掩码。掩码密码在导入时保留，不能作为新的明文密码提交。

## 12. 密码保护和标记为不安全的链接是如何工作的？

- **密码保护**：访问者在重定向前会看到一个密码表单。程序化客户端在请求短链接时可以发送 `x-link-password` 请求头。
- **不安全警告**：标记为不安全的链接在重定向前会显示一个警告页面。程序化客户端在确认目标后可以发送 `x-link-confirm: true`。
- **自动不安全检测**：将 `NUXT_SAFE_BROWSING_DOH` 设置为一个 DoH 端点，可在创建或编辑时自动将可疑目标标记为不安全。

## 13. 地区路由是如何工作的？

地区路由根据 Cloudflare 的 `request.cf.country` 值将访问者重定向到特定国家/地区的 URL。在链接设置或 API 的 `geo` 字段中配置一个两位国家/地区代码映射，例如 `{ "US": "https://example.com/us" }`。

当 Apple 或 Android 设备专用 URL 与访问者匹配时，设备路由优先。

## 14. 我如何导出分析数据？

使用仪表板的访问导出功能，或调用 `GET /api/stats/export` 并使用与分析视图相同的筛选参数，例如 `startAt`、`endAt`、`slug`、`country`、`browser` 或 `device`。API 返回一个 CSV 文件，包含 `slug`、`url`、`viewer`、`views` 和 `referer` 列。

