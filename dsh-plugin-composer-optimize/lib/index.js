import { readJsonBody, sendJson, httpFetch } from "./shared.js";

/**
 * dsh-plugin-composer-optimize
 *
 * 输入框润色（宿主侧）：`POST /composer/optimize`，body `{ text }`。
 * 用当前配置的 DeepSeek 连接（baseURL + API key，与 llm-deepseek 一致）调
 * `/chat/completions`，把用户输入润色为更清晰、具体、结构化的提示词。
 */

/** 稳定 Cordis 插件名。 */
const name = "composer-optimize";

/** 需要 webServer（路由）、llm（连接/凭据）、agentDefaultModel（默认模型）。 */
const inject = ["webServer", "llm", "agentDefaultModel"];

/** 单个请求的最大输入字符数。 */
const MAX_TEXT_CHARS = 20000;

/** 润色用的 system 指令。 */
const SYSTEM_PROMPT = [
  "你是一个提示词润色助手。",
  "请在不改变用户意图的前提下，把用户输入优化为更清晰、具体、结构化、可执行的提示词。",
  "补全缺失的上下文约束、明确输出格式与目标，保持语言与用户一致。",
  "只输出优化后的提示词本身，不要任何解释、前后缀或引号。"
].join("");

/** 解析 deepseek-official 连接的 baseURL 与 API key（与 llm-deepseek 同一套解析）。 */
async function resolveConnection(ctx) {
  const llm = ctx.get("llm");
  const registration = llm.registration("deepseek-official");
  const adapter = registration.adapter;
  const connection = adapter.config.options();
  const apiKey = await adapter.config.resolveApiKey(connection);
  return { baseURL: connection.baseURL, apiKey };
}

/**
 * 调用 DeepSeek chat/completions 润色文本。
 * @param ctx - 插件上下文。
 * @param text - 用户输入。
 * @returns 润色后的文本。
 */
async function optimizeText(ctx, text) {
  const { baseURL, apiKey } = await resolveConnection(ctx);
  let model;
  try {
    const selection = ctx.agentDefaultModel.currentSelection();
    model = selection.model;
  } catch {
    model = "deepseek-v4-flash";
  }
  const payload = {
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: text }
    ],
    temperature: 0.3,
    max_tokens: 4096,
    stream: false
  };
  const response = await httpFetch(`${baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
      accept: "application/json"
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(60000)
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.error?.message ?? `HTTP ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || content.trim().length === 0) {
    throw new Error("模型没有返回润色结果");
  }
  return content.trim();
}

/**
 * 安装插件：注册 `/composer/optimize` 路由。
 * @param ctx - 插件上下文（已注入 webServer/llm/agentDefaultModel）。
 */
function apply(ctx) {
  ctx.effect(() => {
    const disposer = ctx.webServer.register({
      kind: "exact",
      path: "/composer/optimize",
      handler: async (req, res) => {
        try {
          const body = await readJsonBody(req);
          const text = typeof body?.text === "string" ? body.text.trim() : "";
          if (text.length === 0) {
            sendJson(res, 400, { ok: false, message: "请求体需要非空 { text }" });
            return;
          }
          if (text.length > MAX_TEXT_CHARS) {
            sendJson(res, 400, { ok: false, message: `输入过长（上限 ${MAX_TEXT_CHARS} 字符）` });
            return;
          }
          const result = await optimizeText(ctx, text);
          sendJson(res, 200, { ok: true, text: result });
        } catch (error) {
          const status = error instanceof Error && error.status !== void 0 ? error.status : 502;
          sendJson(res, status, {
            ok: false,
            message: `润色失败：${error instanceof Error ? error.message : String(error)}`
          });
        }
      }
    });
    return disposer;
  }, "composer-optimize: /composer/optimize route");
}

export { apply, inject, name };
