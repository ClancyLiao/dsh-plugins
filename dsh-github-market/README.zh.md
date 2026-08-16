# dsh-plugin-market

DSH 插件市场（宿主侧）：把 GitHub [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic
变成桌面端可浏览、可搜索、可安装的插件市场。

## 功能（v1）

- **浏览**：按"最新更新 / 最多 Star"排序，分页加载（每页 50，`加载更多` 翻页）；
- **搜索**：关键词走 GitHub 原生搜索（在整个 topic 里搜）；
- **安装**：npm 优先（仓库已发布 npm 包 → `name@latest`），未发布的 git 仓库在无 Git 时给出安装指引；
- **缓存**：列表按 (搜索词, 排序, 页码) 缓存到 `$DSH_HOME/market-cache.json`，TTL 30 分钟；
- **时刻获取最新**：后台每 30 分钟预热"最新更新"前 2 页；
- **重启**：安装完成后一键请求重启 DSH Desktop。

## HTTP 路由

| 路由 | 方法 | 说明 |
| --- | --- | --- |
| `/plugin-market/list?q=&sort=&page=` | GET | 目录页（GitHub Search API + 缓存） |
| `/plugin-market/installed` | GET | 当前 profile 已安装的第三方插件 |
| `/plugin-market/install` | POST | `{ owner, repo, branch? }` 安装 |
| `/plugin-market/restart` | POST | 请求桌面端重启应用 |

## 安全

- 安装 spec 由宿主端从仓库信息构造，拒绝任意字符串，避免命令注入；
- 前端安装前二次确认（第三方代码会在设备上执行）；
- 只做"安装/更新"，不做无人值守自动安装。

## 限制

- GitHub 未认证限速（搜索约 10 次/分钟）→ 依赖缓存，超限时降级显示缓存并提示稍后重试；
- topic 含非插件噪音仓库，安装时会探测 `package.json` 校验；
- 本机无 Git 时 git-only 仓库无法安装（提示先装 Git）。
