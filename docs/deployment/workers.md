# 在 Cloudflare Workers 上部署

1. [Fork](https://github.com/miantiao-me/Sink/fork) 该仓库到你的 GitHub 账户。
2. 创建一个 [KV 命名空间](https://developers.cloudflare.com/kv/)（在 **存储和数据库** -> **KV** 下），并复制命名空间 ID。
3. 将 `wrangler.jsonc` 中的 `kv_namespaces` ID 更新为你自己的命名空间 ID。
4. （_可选_）如需 OpenGraph 图片上传功能，创建一个名为 `sink` 的 [R2 存储桶](https://developers.cloudflare.com/r2/)（或运行 `wrangler r2 bucket create sink`）。如果不需要此功能，注释掉 `wrangler.jsonc` 中的 `r2_buckets` 部分。
5. 在 [Cloudflare Workers](https://developers.cloudflare.com/workers/) 中创建一个项目。
6. 选择 `Sink` 仓库并使用以下构建和部署命令：
   - **构建命令**：`pnpm run build` 或 `npm run build`
   - **部署命令**：`npx wrangler deploy`

7. 保存并部署项目。
8. 部署完成后，前往 **设置** -> **变量和密钥** -> **添加**，并配置以下环境变量：
   - `NUXT_SITE_TOKEN`：长度必须至少为 **8** 个字符。此令牌用于访问你的仪表板。
   - `NUXT_CF_ACCOUNT_ID`：查找你的[账户 ID](https://developers.cloudflare.com/fundamentals/setup/find-account-and-zone-ids/)。
   - `NUXT_CF_API_TOKEN`：创建一个至少具有 `Account.Account Analytics` 权限的 [Cloudflare API 令牌](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)。[参考文档。](https://developers.cloudflare.com/analytics/analytics-engine/sql-api/#authentication)

9. 启用 Analytics Engine。在 **Workers & Pages** 中，前往右侧面板的 **账户详情**，找到 **Analytics Engine**，然后点击 **Set up** 以启用免费套餐。将它们命名为 `sink` 和 `ANALYTICS`，或者使用 `NUXT_DATASET` 覆盖并相应更新你的 `wrangler.jsonc`。
10. 重新部署项目。
11. 如需更新代码，请参考官方 GitHub 文档：[从 Web UI 同步复刻分支](https://docs.github.com/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork#syncing-a-fork-branch-from-the-web-ui 'GitHub: 同步复刻')。

