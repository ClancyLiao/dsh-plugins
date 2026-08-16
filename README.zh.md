# dsh-plugins

[DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) 插件合集（topic：`dsh-plugin`）。

| 包 | 功能 |
| --- | --- |
| [dsh-think-in-chinese](dsh-think-in-chinese) | 让模型的思考/推理内容始终使用简体中文输出 |
| [dsh-plugin-inventory-notes](dsh-plugin-inventory-notes) + [dsh-client-ui-plugin-notes](dsh-client-ui-plugin-notes) | 设置 → 插件列表：每张卡片显示一句话简介 |
| [dsh-github-market](dsh-github-market) + [dsh-client-ui-github-market](dsh-client-ui-github-market) | 插件市场标签页：浏览/搜索/安装 GitHub `dsh-plugin` 插件 |
| [dsh-plugin-composer-optimize](dsh-plugin-composer-optimize) + [dsh-client-ui-composer-optimize](dsh-client-ui-composer-optimize) | 输入框右下角魔法棒：用模型优化当前输入（类似 workbuddy） |
| [dsh-plugin-account-usage](dsh-plugin-account-usage) + [dsh-client-ui-account-usage](dsh-client-ui-account-usage) | 侧边栏底部显示 DeepSeek 账号余额与可用状态 |

## 安装

每个包都是标准 [dsh bundle](https://github.com/deepseek-ai/DeepSeek-Harness/blob/master/docs/user/develop/basic/publish.zh.md)。
尚未发布到 npm，请用本仓库 checkout 安装：

```sh
git clone https://github.com/ClancyLiao/dsh-plugins
cd dsh-plugins
dsh plugin --profile <profile> add ./dsh-think-in-chinese
```

需要哪些包就重复 `dsh plugin add ./<包名>`，例如：

```sh
dsh plugin --profile desktop add ./dsh-plugin-inventory-notes
dsh plugin --profile desktop add ./dsh-client-ui-plugin-notes
dsh plugin --profile desktop add ./dsh-github-market
dsh plugin --profile desktop add ./dsh-client-ui-github-market
dsh plugin --profile desktop add ./dsh-plugin-composer-optimize
dsh plugin --profile desktop add ./dsh-client-ui-composer-optimize
dsh plugin --profile desktop add ./dsh-plugin-account-usage
dsh plugin --profile desktop add ./dsh-client-ui-account-usage
```

安装后重启 DSH Desktop（或重新 `dsh --profile <profile>`）生效。

> 注意：`dsh-plugin-inventory-notes` 会禁用内置的 `ui-settings-plugin-inventory` 行
> （由 `dsh-client-ui-plugin-notes` 替换插件列表标签页）。

## 开发

全部为纯 ESM，无构建步骤。`lib/index.js` 是宿主半部分（插件主体），
client 插件的 `lib/client.js` 是浏览器半部分（`package.json` 声明 `dsh.client`）。

## 许可

MIT
