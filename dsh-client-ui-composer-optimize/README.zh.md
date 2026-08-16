# dsh-client-ui-composer-optimize

输入框润色（浏览器侧）：在对话输入框的**右下角**（发送键左边）显示一个魔法棒图标，
点击后用模型把当前输入内容优化为更清晰、具体、结构化的提示词，并回填到输入框。

## 功能

- 输入为空时点击 → 提示"没有可优化的内容"；
- 优化中按钮转圈禁用；成功 → 回填优化文本并提示；失败 → 提示错误原因；
- 按钮位置通过 flex `order` 排到发送键正左侧。

## 配套

需要宿主侧插件 `dsh-plugin-composer-optimize`（提供 `/composer/optimize` 路由）。

## 安装

```sh
dsh plugin --profile <profile> add dsh-client-ui-composer-optimize
dsh plugin --profile <profile> add dsh-plugin-composer-optimize
```

重启 DSH Desktop（或重新 `dsh --profile <profile>`）后生效。
