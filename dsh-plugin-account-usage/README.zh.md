# dsh-plugin-account-usage + dsh-client-ui-account-usage

账户余额插件：在**侧边栏底部**显示当前 DeepSeek 账号的 API 余额与可用状态，
点击展开明细浮层（币种 / 总余额 / 赠送 / 充值 / 更新时间 / 手动刷新）。

## 组成

| 包 | 侧 | 说明 |
| --- | --- | --- |
| `dsh-plugin-account-usage` | 宿主 | `GET /account/usage`，用 llm-deepseek 同一套 baseURL/API key 调 `/user/balance`，内存缓存 5 分钟 |
| `dsh-client-ui-account-usage` | 浏览器 | 注册 `sidebar.footer.action` 槽（底部徽标），每 5 分钟自动刷新 |

## 安装

```yaml
- insert:
    - id: account-usage
      name: dsh-plugin-account-usage
    - id: ui-account-usage
      name: dsh-client-ui-account-usage
```

## 数据来源

- 余额：DeepSeek 官方 `GET {baseURL}/user/balance`（与 `dsh-llm-deepseek` 同一连接与凭据）；
- 缓存：5 分钟，避免高频调用接口；
- 侧边栏折叠态只显示状态点与图标，展开态显示金额。
