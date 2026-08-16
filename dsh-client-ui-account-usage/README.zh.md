# dsh-client-ui-account-usage

账户余额（浏览器侧）：在**侧边栏底部**显示当前 DeepSeek 账号的 API 余额与可用状态，
点击展开明细浮层。

## 功能

- 侧边栏底部徽标：状态点 + 钱包图标 + 金额（折叠态只显示状态点与图标）；
- 点击弹出明细：可用状态、币种、总余额/赠送/充值、更新时间、手动刷新；
- 每 5 分钟自动刷新一次。

## 配套

需要宿主侧插件 `dsh-plugin-account-usage`（提供 `/account/usage` 路由）。

## 安装

```sh
dsh plugin --profile <profile> add dsh-client-ui-account-usage
dsh plugin --profile <profile> add dsh-plugin-account-usage
```

重启 DSH Desktop（或重新 `dsh --profile <profile>`）后生效。
