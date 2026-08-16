import z from "@deepseek-ai/schemastery";

/**
 * dsh-think-in-chinese
 *
 * 让模型的所有思考/推理（thinking / reasoning）内容使用简体中文输出。
 *
 * 实现方式：向系统提示词（dsh-system-prompt 的 systemPrompt 服务）注册一个
 * 段落，指示模型在思考、推理、规划、草稿以及对工具调用结果的分析中一律使用
 * 简体中文。该段落对所有 agent（含子 agent）生效，作用于每次模型调用前
 * 组装出的系统提示词。
 *
 * 可通过配置文件覆盖指令文本（text）、段落排序（order），或用
 * answersInChinese 让最终回答也强制使用简体中文。
 */

/** Cordis 插件名。 */
const name = "think-in-chinese";

/** 该插件需要 systemPrompt 服务就绪后才启动。 */
const inject = ["systemPrompt"];

/** 默认指令：思考与推理使用简体中文，最终回答遵循用户语言。 */
const DEFAULT_TEXT = [
  "你始终使用简体中文进行思考、推理与分析。",
  "所有内部思维过程（thinking / reasoning）、推理链、计划、草稿，以及对工具调用结果的分析，都必须使用简体中文书写。",
  "最终回答遵循用户使用的语言；思考与推理内容始终使用简体中文。"
].join("\n");

/** 插件配置：指令文本、段落排序、是否强制最终回答也用中文。 */
const Config = z.object({
  /** 注入到系统提示词中的指令文本（可自定义）。 */
  text: z.string().default(DEFAULT_TEXT),
  /** 该提示词段落的排序位置（数值越小越靠前；persona 为 0）。 */
  order: z.number().default(5),
  /** 为 true 时，额外要求最终回答也必须使用简体中文。 */
  answersInChinese: z.boolean().default(false)
});

/**
 * 安装插件：向系统提示词注册“思考使用中文”的段落。
 * @param ctx - 插件上下文（已注入 systemPrompt 服务）。
 * @param config - 校验后的配置。
 */
function apply(ctx, config) {
  const text = config.answersInChinese
    ? `${config.text}\n最终回答同样必须使用简体中文。`
    : config.text;
  ctx.effect(
    () => ctx.systemPrompt.section({
      name: "deployment:think-in-chinese",
      order: config.order,
      text
    }),
    "think-in-chinese.section()"
  );
}

export { Config, DEFAULT_TEXT, apply, inject, name };
export default { name, inject, Config, apply };
