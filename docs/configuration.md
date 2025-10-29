# Sink Configuration

Sink提供了一些配置选项，可参考[.env.example](../.env.example)。

> 使用Worker部署时，请注意带有`NUXT_PUBLIC_`前缀的变量需要配置在Workers的**Settings** -> **Build** -> **Variables and Secrets**以及**Settings** -> **Variables and Secrets**中。

## `NUXT_PUBLIC_PREVIEW_MODE`

> 如果你使用Worker部署，此变量需要配置在**Settings** -> **Build** -> **Variables and Secrets**以及**Settings** -> **Variables and Secrets**中。

将网站设置为演示模式，生成的链接将在5分钟后过期，且这些链接无法编辑或删除。

## `NUXT_PUBLIC_SLUG_DEFAULT_LENGTH`

> 如果你使用Worker部署，此变量需要配置在**Settings** -> **Build** -> **Variables and Secrets**以及**Settings** -> **Variables and Secrets**中。

设置生成的SLUG的默认长度。

## `NUXT_REDIRECT_STATUS_CODE`

重定向默认使用HTTP 301状态码，你可以将其设置为`302`/`307`/`308`。

## `NUXT_LINK_CACHE_TTL`

缓存链接可以加快访问速度，但设置过长可能会导致更改生效缓慢。默认值为60秒。

## `NUXT_REDIRECT_WITH_QUERY`

默认情况下，链接重定向时不携带URL参数，不建议启用此功能。

## `NUXT_HOME_URL`

Sink的默认首页是介绍页面，你可以将其替换为自己的网站。

## `NUXT_DATASET`

Analytics Engine的数据集，除非需要切换数据库并清除历史数据，否则不建议修改。

## `NUXT_AI_MODEL`

你可以自行修改大模型。支持的模型名称可查看[Workers AI Models](https://developers.cloudflare.com/workers-ai/models/#text-generation)。

## `NUXT_AI_PROMPT`

支持自定义提示词，建议保留占位符{slugRegex}。

默认提示词：

```txt
你是一个URL缩短助手，请将用户提供的URL缩短为一个SLUG。SLUG信息必须来自URL本身，不要做任何假设。SLUG应易于人类阅读，不超过三个单词，且可通过正则表达式{slugRegex}验证。只返回最佳结果，格式必须为JSON，参考{"slug": "example-slug"}
```

## `NUXT_CASE_SENSITIVE`

设置URL的大小写敏感性。

## `NUXT_LIST_QUERY_LIMIT`

设置指标列表的最大查询数据量。

## `NUXT_DISABLE_BOT_ACCESS_LOG`

访问统计不计算机器人流量。

## `NUXT_API_CORS`

构建时设置环境变量`NUXT_API_CORS=true`以启用API的CORS支持。
