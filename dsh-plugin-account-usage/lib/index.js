import { sendJson, httpFetch } from "./shared.js";

/**
 * dsh-plugin-account-usage
 *
 * 账户余额/使用情况（宿主侧）：`GET /account/usage`。
 * 用当前 DeepSeek 连接（baseURL + API key）调 `/user/balance`，返回余额明细，
 * 内存缓存 5 分钟，避免高频打接口。
 */

/** 稳定 Cordis 插件名。 */
const name = "account-usage";

/** 需要 webServer（路由）与 llm（连接/凭据）。 */
const inject = ["webServer", "llm"];

/** 余额接口缓存时长。 */
const CACHE_TTL_MS = 5 * 60 * 1000;

/** 内存缓存：{ fetchedAt, payload } 或 undefined。 */
let cache;

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
 * 获取余额（带缓存）。
 * @param ctx - 插件上下文。
 * @returns `{ ok, balance, fetchedAt, cached }`。
 */
async function fetchBalance(ctx) {
  const now = Date.now();
  if (cache !== void 0 && now - cache.fetchedAt < CACHE_TTL_MS) {
    return { ...cache.payload, fetchedAt: cache.fetchedAt, cached: true };
  }
  const { baseURL, apiKey } = await resolveConnection(ctx);
  const response = await httpFetch(`${baseURL}/user/balance`, {
    method: "GET",
    headers: { authorization: `Bearer ${apiKey}`, accept: "application/json" },
    signal: AbortSignal.timeout(15000)
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.error?.message ?? `HTTP ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }
  const payload = {
    ok: true,
    balance: {
      isAvailable: data.is_available === true,
      infos: Array.isArray(data.balance_infos)
        ? data.balance_infos.map((entry) => ({
            currency: entry.currency ?? "",
            total: Number(entry.total_balance ?? 0),
            granted: Number(entry.granted_balance ?? 0),
            toppedUp: Number(entry.topped_up_balance ?? 0)
          }))
        : []
    }
  };
  cache = { fetchedAt: now, payload };
  return { ...payload, fetchedAt: now, cached: false };
}

/**
 * 安装插件：注册 `/account/usage` 路由。
 * @param ctx - 插件上下文（已注入 webServer/llm）。
 */
function apply(ctx) {
  ctx.effect(() => {
    const disposer = ctx.webServer.register({
      kind: "exact",
      path: "/account/usage",
      handler: async (_req, res) => {
        try {
          const result = await fetchBalance(ctx);
          sendJson(res, 200, result);
        } catch (error) {
          const status = error instanceof Error && error.status !== void 0 ? error.status : 502;
          sendJson(res, status, {
            ok: false,
            message: `获取余额失败：${error instanceof Error ? error.message : String(error)}`
          });
        }
      }
    });
    return disposer;
  }, "account-usage: /account/usage route");
}

export { apply, inject, name };
