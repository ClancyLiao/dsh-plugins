# dsh-plugin-composer-optimize + dsh-client-ui-composer-optimize

输入框润色插件：在对话输入框的**右下角**显示一个魔法棒图标（类似 workbuddy 的优化功能），
点击后用当前配置的 DeepSeek 模型把输入内容优化为更清晰、具体、结构化的提示词，
并回填到输入框。

## 组成

| 包 | 侧 | 说明 |
| --- | --- | --- |
| `dsh-plugin-composer-optimize` | 宿主 | `POST /composer/optimize`，body `{ text }`，用 llm-deepseek 同一套 baseURL/API key 调 `/chat/completions` 润色 |
| `dsh-client-ui-composer-optimize` | 浏览器 | 注册 `conversation.input.right` 槽（右下角），读写 draft 走 `conversation.input.for(session)` 的 `setDraft`/`notify` |

## 安装

```yaml
- insert:
    - id: composer-optimize
      name: dsh-plugin-composer-optimize
    - id: ui-composer-optimize
      name: dsh-client-ui-composer-optimize
```

## 行为

- 输入框为空时点击 → 提示"没有可优化的内容"；
- 优化中按钮转圈禁用；成功 → 回填优化文本 + 提示；失败 → 提示错误原因；
- 模型跟随 `agentDefaultModel`（当前默认模型），未配置时回退 `deepseek-v4-flash`。
