# 在Cloudflare Workers上部署

1. [Fork](https://github.com/ccbikai/Sink/fork) 该仓库到你的GitHub账户。
2. 创建 [KV namespace](https://developers.cloudflare.com/kv/)（在**存储与数据库** -> **KV** 下），并复制命名空间ID。
3. 在`wrangler.jsonc`中，将`kv_namespaces`的ID更新为你自己的命名空间ID。
4. 在[Cloudflare Workers](https://developers.cloudflare.com/workers/)中创建一个项目。
5. 选择`Sink`仓库，并使用以下构建和部署命令：
   - **构建命令**：`pnpm run build` 或 `npm run build`
   - **部署命令**：`npx wrangler deploy`

6. 保存并部署项目。
7. 部署后，进入**设置** -> **变量与密钥** -> **添加**，配置以下环境变量：
   - `NUXT_SITE_TOKEN`：长度必须至少为**8**个字符。此令牌用于授予访问你的仪表盘的权限。
   - `NUXT_CF_ACCOUNT_ID`：查找你的[账户ID](https://developers.cloudflare.com/fundamentals/setup/find-account-and-zone-ids/)。
   - `NUXT_CF_API_TOKEN`：创建一个[Cloudflare API令牌](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)，至少需要`Account.Account Analytics`权限。[参见参考](https://developers.cloudflare.com/analytics/analytics-engine/sql-api/#authentication)。

8. 启用分析引擎。在**Workers & Pages**中，在右侧面板进入**账户详情**，找到**分析引擎**，点击**设置**以启用免费套餐。
9. 重新部署项目。
10. 如需更新代码，请参考GitHub官方文档：[通过Web界面同步分支](https://docs.github.com/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork#syncing-a-fork-branch-from-the-web-ui 'GitHub：同步分支')。
