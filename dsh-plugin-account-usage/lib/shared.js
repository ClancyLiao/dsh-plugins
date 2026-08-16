/**
 * 共享宿主工具：HTTPS 请求封装 + HTTP 路由的 JSON 读写。
 */

/**
 * HTTPS 请求封装：优先 Electron 的 `net.fetch`（Chromium 网络栈，信任系统根证书，
 * 在 DSH Desktop 主进程中最可靠），回退到 Node 全局 fetch（纯 Node 的 web profile）。
 */
let electronNetFetch;
let electronNetResolved = false;
export async function httpFetch(url, init) {
  if (!electronNetResolved) {
    electronNetResolved = true;
    try {
      const mod = await import("electron");
      electronNetFetch = typeof mod?.net?.fetch === "function" ? mod.net.fetch : null;
    } catch {
      electronNetFetch = null;
    }
  }
  if (typeof electronNetFetch === "function") return electronNetFetch(url, init);
  return globalThis.fetch(url, init);
}

/** 解析 JSON 请求体（body 为空或非法时返回 null）。 */
export async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** 发送 JSON 响应。 */
export function sendJson(res, status, body) {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "content-length": Buffer.byteLength(text)
  });
  res.end(text);
}
