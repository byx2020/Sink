# 在Cloudflare Pages上部署

1. [Fork](https://github.com/ccbikai/Sink/fork) 该仓库到你的GitHub账户。
2. 在[Cloudflare Pages](https://developers.cloudflare.com/pages/)中创建一个项目。
3. 选择`Sink`仓库并选择`Nuxt.js`预设。
4. 配置以下环境变量：
   - `NUXT_SITE_TOKEN`：长度必须至少为**8**个字符。此令牌用于授予访问你的仪表盘的权限。
   - `NUXT_CF_ACCOUNT_ID`：查找你的[账户ID](https://developers.cloudflare.com/fundamentals/setup/find-account-and-zone-ids/)。
   - `NUXT_CF_API_TOKEN`：创建一个[Cloudflare API令牌](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)，至少需要`Account.Account Analytics`权限。[参见参考](https://developers.cloudflare.com/analytics/analytics-engine/sql-api/#authentication)。

5. 保存并部署项目。
6. 取消部署，然后进入**设置** -> **绑定** -> **添加**：
   - **KV命名空间**：将变量名`KV`绑定到一个[KV namespace](https://developers.cloudflare.com/kv/)（在**存储与数据库** -> **KV** 下创建一个新的）。
   - **Workers AI**（_可选_）：将变量名`AI`绑定到Workers AI Catalog。
   - **分析引擎**：
     - 在**Workers & Pages**中，在右侧面板进入**账户详情**，找到`Analytics Engine`，点击`Set up`以启用免费套餐。
     - 返回**设置** -> **绑定** -> **添加**，选择**分析引擎**。
     - 将变量名`ANALYTICS`绑定到`sink`数据集。

7. 添加兼容性标志
   - 进入**设置** -> **运行时** -> **兼容性标志**，并设置以下标志`nodejs_compat`。
8. 重新部署项目。
9. 如需更新代码，请参考GitHub官方文档[通过Web界面同步分支](https://docs.github.com/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork#syncing-a-fork-branch-from-the-web-ui 'GitHub：同步分支')。
