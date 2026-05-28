# Sink 配置

Sink 提供了一些配置选项，可参考 [.env.example](../.env.example)。

> 使用 Worker 部署时，请注意带有 `NUXT_PUBLIC_` 前缀的变量需要在 Workers 的 **设置** -> **构建** -> **变量和密钥** 以及 **设置** -> **变量和密钥** 中进行配置。

## `NUXT_PUBLIC_PREVIEW_MODE`

> 如果你使用的是 Worker 部署，此变量需要在 **设置** -> **构建** -> **变量和密钥** 以及 **设置** -> **变量和密钥** 中进行配置。

将站点设置为演示模式，生成的链接将在 5 分钟后过期，且链接无法被编辑或删除。

## `NUXT_PUBLIC_SLUG_DEFAULT_LENGTH`

> 如果你使用的是 Worker 部署，此变量需要在 **设置** -> **构建** -> **变量和密钥** 以及 **设置** -> **变量和密钥** 中进行配置。

设置生成的 SLUG 的默认长度。

## `NUXT_PUBLIC_KV_BATCH_LIMIT`

> 如果你使用的是 Worker 部署，此变量需要在 **设置** -> **构建** -> **变量和密钥** 以及 **设置** -> **变量和密钥** 中进行配置。

设置每次请求导入/导出的最大 KV 操作数。默认为 50（Cloudflare Workers 每次请求限制）。导入操作使用此值的一半，因为每个链接需要 2 次 KV 操作（检查是否存在 + 写入）。

## `NUXT_REDIRECT_STATUS_CODE`

重定向默认使用 HTTP 301 状态码，你可以将其设置为 `302`/`307`/`308`。

## `NUXT_LINK_CACHE_TTL`

缓存链接可以加快访问速度，但设置过长可能导致更改生效缓慢。默认值为 60 秒。

## `NUXT_REDIRECT_WITH_QUERY`

默认情况下，链接重定向时不携带 URL 参数，不建议启用此功能。这是全局默认值；单个链接可通过**链接设置**中的 **带查询参数重定向** 开关进行覆盖。

## `NUXT_HOME_URL`

> 如果你使用的是 Worker 部署，此变量需要在 **设置** -> **构建** -> **变量和密钥** 以及 **设置** -> **变量和密钥** 中进行配置。

Sink 的默认首页是介绍页，你可以将其替换为自己的网站。

## `NUXT_DATASET`

Analytics Engine 的数据集，除非你需要切换数据库并清除历史数据，否则不建议修改。

## `NUXT_AI_MODEL`

你可以修改用于 AI slug 和 OpenGraph 元数据生成的大模型。支持的名称可查看 [Workers AI Models](https://developers.cloudflare.com/workers-ai/models/#text-generation)。

## `NUXT_AI_PROMPT`

支持自定义 AI slug 生成的提示词。建议保留占位符 `{slugRegex}`。Sink 会将 URL 以及（如果可用）提取的页面内容发送给模型。

默认提示词：

```txt
You are a URL shortening assistant, please shorten the URL provided by the user into a SLUG. The SLUG information should be derived from the URL and page content (if provided). Do not make any assumptions beyond the given information. A SLUG is human-readable and should not exceed three words and can be validated using regular expressions {slugRegex} . Only the best one is returned, the format must be JSON reference {"slug": "example-slug"}
```

## `NUXT_AI_OG_PROMPT`

支持自定义 AI OpenGraph 标题和描述生成的提示词。Sink 会将首选语言环境附加到提示词中，以便生成的元数据与访问者或仪表盘语言匹配。

默认提示词：

```txt
You are an OpenGraph metadata assistant. Please summarize the page content provided by the user into a perfect title and description for an OpenGraph preview. Do not make any assumptions beyond the given information. Only the best one is returned, the format must be JSON reference {"title": "Example Title", "description": "Example description that summarizes the page accurately."}
```

## `NUXT_CASE_SENSITIVE`

设置 URL 大小写敏感性。

## `NUXT_LIST_QUERY_LIMIT`

设置 Metric 列表的最大查询数据量。

## `NUXT_DISABLE_BOT_ACCESS_LOG`

访问统计不计算机器人流量。

## `NUXT_API_CORS`

在构建时设置环境变量 `NUXT_API_CORS=true` 以启用对 API 的 CORS 支持。

## `NUXT_DISABLE_AUTO_BACKUP`

设置为 `true` 以禁用自动每日 KV 备份到 R2 存储。默认为 `false`。

此功能需要：

1. 在 `wrangler.jsonc` 中配置 R2 存储桶绑定
2. 创建 R2 存储桶：`wrangler r2 bucket create sink`

备份存储在 R2 中，路径为 `backups/links-{timestamp}.json`，每日 UTC 时间 00:00 运行。

## `NUXT_SAFE_BROWSING_DOH`

设置为 DNS over HTTPS (DoH) 端点 URL，以在创建或编辑链接时启用自动不安全链接检测。启用后，Sink 会查询 DoH 服务以检查目标域名是否被标记为恶意。如果域名解析为 `0.0.0.0`，该链接将自动被标记为不安全，访问者在重定向前会看到警告页面。

推荐值：

- `https://family.cloudflare-dns.com/dns-query` — Cloudflare Family DNS（阻止恶意软件和成人内容）
- 自定义 [Cloudflare Zero Trust Gateway](https://developers.cloudflare.com/cloudflare-one/policies/gateway/) DoH URL — 支持自定义阻止列表、域名风险类别及更精细的控制

默认值为空（禁用）。无论此设置如何，用户仍可在仪表盘中手动将链接标记为不安全。

## `NUXT_NOT_FOUND_REDIRECT`

可选的当 slug 未找到时的自定义重定向目标。
如果未设置，Sink 将回退到其默认的 404 页面。

