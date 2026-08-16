# dsh-client-ui-github-market

插件市场（浏览器侧）：在设置 → 插件里新增一个**"插件市场"**标签页，
浏览/搜索/一键安装 GitHub [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic 的插件。

## 功能

- 搜索（防抖，走 GitHub 原生搜索，在整个 topic 里搜）；
- 排序：最新更新 / 最多 Star；"加载更多"分页（每页 50）；
- 卡片：仓库名、描述、★、语言、更新时间、已安装徽标；
- 安装按钮：二次确认 → 安装 → 结果反馈 → "立即重启"按钮。

## 配套

需要宿主侧插件 `dsh-github-market`（提供 `/plugin-market/*` 路由与缓存）。

## 安装

```sh
dsh plugin --profile <profile> add dsh-client-ui-github-market
dsh plugin --profile <profile> add dsh-github-market
```

重启 DSH Desktop（或重新 `dsh --profile <profile>`）后生效。
