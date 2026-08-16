# dsh-plugin-inventory-notes

宿主侧插件：为插件清单界面提供每个插件的简介。

## 工作原理

注册一个 HTTP 路由 `/plugin-notes.json`，返回：

```json
{ "notes": { "<moduleName>": { "zh": "中文简介", "en": "英文描述" } } }
```

简介来源：
- **中文（zh）**：包的 `README.zh.md` 第一段正文摘要（自动清理 markdown 记号）；
- **英文（en）**：包的 `package.json` 的 `description`。

包目录按 Node 模块解析规则从当前 profile 目录解析，因此任何已安装插件
（内置 `@deepseek-ai` 包、`dsh-plugin-desktop`、用户自装插件）都能自动拿到简介，
无需维护静态清单。

## 安装

在 profile 的 `cordis.patch.yml` 中：

```yaml
- insert:
    - id: inventory-notes
      name: dsh-plugin-inventory-notes
```

配合浏览器侧插件 `dsh-client-ui-plugin-notes` 在设置界面展示。

## 验证

```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:<port>/plugin-notes.json"
```
