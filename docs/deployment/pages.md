# 在 Cloudflare Pages 上部署

1. [Fork](https://github.com/miantiao-me/Sink/fork) 该仓库到你的 GitHub 账户。
2. 在 [Cloudflare Pages](https://developers.cloudflare.com/pages/) 中创建一个项目。
3. 选择 `Sink` 仓库并选择 `Nuxt.js` 预设。
4. 配置以下环境变量：
   - `NUXT_SITE_TOKEN`：长度必须至少为 **8** 个字符。此令牌用于访问你的仪表板。
   - `NUXT_CF_ACCOUNT_ID`：查找你的[账户 ID](https://developers.cloudflare.com/fundamentals/setup/find-account-and-zone-ids/)。
   - `NUXT_CF_API_TOKEN`：创建一个至少具有 `Account.Account Analytics` 权限的 [Cloudflare API 令牌](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)。[参考文档。](https://developers.cloudflare.com/analytics/analytics-engine/sql-api/#authentication)

5. 保存并部署项目。
6. 取消部署，然后前往 **设置** -> **绑定** -> **添加**：
   - **KV 命名空间**：将变量名 `KV` 绑定到一个 [KV 命名空间](https://developers.cloudflare.com/kv/)（在 **存储和数据库** -> **KV** 下创建一个新的）。
   - **Workers AI**（_可选_）：将变量名 `AI` 绑定到 Workers AI Catalog。
   - **R2 存储桶**（_可选，用于 OpenGraph 图片上传_）：在 **存储和数据库** -> **R2** 下创建一个 R2 存储桶，然后将变量名 `R2` 绑定到该存储桶。
   - **Analytics Engine**：
     - 在 **Workers & Pages** 中，前往右侧面板的 **账户详情**，找到 `Analytics Engine`，然后点击 `Set up` 以启用免费套餐。
     - 返回 **设置** -> **绑定** -> **添加**，选择 **Analytics engine**。
     - 将变量名 `ANALYTICS` 绑定到 `sink` 数据集。

7. 添加兼容性标志
   - 前往 **设置** -> **运行时** -> **兼容性标志**，设置标志 `nodejs_compat`。
8. 重新部署项目。
9. 更新代码，请参考官方 GitHub 文档 [从 Web UI 同步复刻分支](https://docs.github.com/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork#syncing-a-fork-branch-from-the-web-ui 'GitHub: 同步复刻')。

