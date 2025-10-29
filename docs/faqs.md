# 常见问题

## 1. 为什么我无法创建链接？

请检查Cloudflare KV绑定，KV环境变量名应为全大写字母。

<details>
  <summary><b>截图</b></summary>
  <img alt="Cloudflare中的KV绑定设置" src="/docs/images/faqs-kv.png"/>
</details>

## 2. 为什么我无法登录？

请检查`NUXT_SITE_TOKEN`是否设置为纯数字，Sink不支持纯数字令牌，我们认为这是不安全的。

## 3. 为什么我看不到分析数据？

分析数据需要正确配置Cloudflare的相关设置：

1. 验证`NUXT_CF_ACCOUNT_ID`和`NUXT_CF_API_TOKEN`是否配置正确（确保账户ID与部署区域ID匹配）。
2. 检查Worker分析引擎是否已启用。

<details>
  <summary><b>截图</b></summary>
  <img alt="Cloudflare中的分析引擎绑定设置" src="/docs/images/faqs-Analytics_engine.png"/>
</details>

## 4. 我不想要当前的首页？可以将其重定向到我的博客吗？

当然可以。请将环境变量`NUXT_HOME_URL`设置为你的博客或官方网站地址。

## 5. 为什么使用NuxtHub部署后看不到统计数据？

NuxtHub的ANALYTICS指向其自身的数据集，你需要设置`NUXT_DATASET`环境变量以指向同一个数据集。

## 6. 为什么链接总是大小写不敏感？

这是Sink的一项特性。默认情况下，我们会自动将所有链接转换为小写，以避免大小写敏感问题并提高可用性。这确保用户不会因意外的大小写差异而遇到错误。

不过，你可以通过将`NUXT_CASE_SENSITIVE`环境变量设置为`true`来禁用此功能。

### 当`NUXT_CASE_SENSITIVE`设为`true`时会发生什么？

新生成的链接将区分大小写，`MyLink`和`mylink`会被视为不同的链接。随机生成的短标识（slug）将包含大小写字母，提供更多的唯一组合（但不够用户友好，这也是我们默认使用大小写不敏感的原因）。

## 7. 为什么指标列表只显示前500条数据？

为了提高查询性能，我们对数据量进行了限制。如果需要查询更多数据，可以通过`NUXT_LIST_QUERY_LIMIT`进行调整。

## 8. 我不想统计机器人或爬虫的流量

将`NUXT_DISABLE_BOT_ACCESS_LOG`设置为`true`即可。
