# dsh-client-ui-plugin-notes

浏览器侧插件：替换设置里的"插件列表"标签页，让每个插件卡片**直接显示一句话简介**，
一眼看出各插件是干什么的。

## 工作原理

- 复用宿主侧 `pluginInventory` Remote 服务拿到全部插件行（名称、启停、挂载状态）；
- 请求宿主侧插件 `dsh-plugin-inventory-notes` 提供的 `/plugin-notes.json` 拿到简介
  （中文优先，缺失时回退英文 description）；
- 以 **相同 slot（`settings.plugins.tab`）+ 相同 id（`all`）+ 更低 priority** 注册，
  shadow 内置的"插件列表"标签页；同时需禁用内置行 `ui-settings-plugin-inventory`
  避免出现两个同名标签。

## 安装

在 profile 的 `cordis.patch.yml` 中：

```yaml
- id: ui-settings-plugin-inventory
  disabled: true
- insert:
    - id: inventory-notes
      name: dsh-plugin-inventory-notes
    - id: ui-plugin-notes
      name: dsh-client-ui-plugin-notes
```

修改后重启 DSH Desktop（或 `dsh --profile web`）生效。

## 界面

- 搜索框：按插件名、包名、中英文简介模糊搜索；
- 卡片网格：标题（模块短名）+ 简介（最多 3 行）+ 启停标签 + 挂载状态圆点；
- 展开卡片：显示 loader entry id、包名、英文描述、配置与挂载状态。
