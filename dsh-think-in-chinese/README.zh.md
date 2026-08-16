# dsh-think-in-chinese

DSH 插件：让模型的所有思考/推理（thinking / reasoning）内容使用简体中文输出。

## 工作原理

向系统提示词注册一个段落（`deployment:think-in-chinese`，位于 persona 之后），
指示模型在思考、推理、规划、草稿以及对工具调用结果的分析中一律使用简体中文。
该段落对所有 agent（含子 agent）生效，作用于每次模型调用前组装出的系统提示词。

## 安装

```sh
dsh plugin --profile <profile> add dsh-think-in-chinese
```

重启 DSH Desktop（或重新 `dsh --profile <profile>`）后生效。

## 配置项

| 字段 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `text` | string | 内置中文指令 | 注入系统提示词的指令文本 |
| `order` | number | 5 | 段落排序（persona 为 0） |
| `answersInChinese` | boolean | false | true 时最终回答也强制中文 |

## 卸载

```sh
dsh plugin --profile <profile> remove dsh-think-in-chinese
```
