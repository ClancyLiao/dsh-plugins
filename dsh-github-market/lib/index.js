import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, isAbsolute } from "node:path";
import { homedir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

/**
 * dsh-plugin-market
 *
 * GitHub `dsh-plugin` topic 插件市场（宿主侧）。
 *
 * - GET  /plugin-market/list?q=&sort=&page=   目录（GitHub Search API + 磁盘缓存）
 * - GET  /plugin-market/installed             当前 profile 已安装的第三方插件
 * - POST /plugin-market/install {owner,repo,branch}  安装（npm 优先，git 兜底）
 * - POST /plugin-market/restart               请求桌面端重启应用
 *
 * 缓存：列表结果按 (q, sort, page) 缓存到内存 + `$DSH_HOME/market-cache.json`，
 * TTL 30 分钟；后台每 30 分钟预热"最新更新"前 2 页，保证打开即有内容。
 * 安装：走 `dsh plugin --profile <active> add <spec>`（应用自带 pnpm），
 * spec 由宿主端从仓库信息构造，拒绝任意字符串，避免注入。
 */

/** 稳定 Cordis 插件名。 */
const name = "market";

/** 需要 webServer（路由）与 loader（枚举已装插件辅助信息）。 */
const inject = ["webServer", "loader"];

const GITHUB_SEARCH = "https://api.github.com/search/repositories";
const GITHUB_RAW = "https://raw.githubusercontent.com";
const NPM_REGISTRY = "https://registry.npmjs.org";
const TOPIC_QUERY = "topic:dsh-plugin";
const CACHE_TTL_MS = 30 * 60 * 1000;
const PREWARM_INTERVAL_MS = 30 * 60 * 1000;
const PREWARM_PAGES = 2;
const PER_PAGE = 50;
const USER_AGENT = "dsh-plugin-market/1.0";

const NPM_NAME = /^(@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/;
const GITHUB_NAME = /^[A-Za-z0-9_.-]+$/;

/**
 * HTTPS 请求封装：优先 Electron 的 `net.fetch`（Chromium 网络栈，信任系统根证书，
 * 在 DSH Desktop 主进程中最可靠），回退到 Node 全局 fetch（纯 Node 的 web profile）。
 * Electron net 只在真实主进程可用（ELECTRON_RUN_AS_NODE 下不可用，但那个环境
 * 只是本插件的离线验证环境）。
 */
let electronNetFetch;
let electronNetResolved = false;
async function httpFetch(url, init) {
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

/** 缓存文件名（放在 Harness home 下）。 */
function cacheFilePath(home) {
  return join(home, "market-cache.json");
}

/** 解析 Harness home：优先 ctx.dshHomePath 服务，回退 ~/.dsh。 */
function resolveHome(ctx) {
  try {
    const via = ctx.dshHomePath;
    if (typeof via === "function") {
      const v = via();
      if (typeof v === "string" && v.length > 0) return v;
    }
  } catch {}
  return join(homedir(), ".dsh");
}

/** 磁盘缓存：读。 */
function readDiskCache(home) {
  try {
    const text = readFileSync(cacheFilePath(home), "utf8");
    const parsed = JSON.parse(text);
    return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

/** 磁盘缓存：写。 */
function writeDiskCache(home, data) {
  try {
    mkdirSync(home, { recursive: true });
    writeFileSync(cacheFilePath(home), JSON.stringify(data));
  } catch {}
}

/** 规范化 GitHub API 返回的一条仓库记录。 */
function normalizeRepo(raw) {
  return {
    fullName: raw.full_name,
    owner: raw.owner?.login ?? "",
    repo: raw.name ?? "",
    branch: raw.default_branch ?? "main",
    description: raw.description ?? "",
    stars: raw.stargazers_count ?? 0,
    language: raw.language ?? "",
    updatedAt: raw.updated_at ?? "",
    htmlUrl: raw.html_url ?? "",
    topics: Array.isArray(raw.topics) ? raw.topics : []
  };
}

/** 调用 GitHub Search API 拉一页。失败时抛出带 status 的 Error。 */
async function fetchGitHubPage(q, sort, page) {
  const params = new URLSearchParams({
    q: `${TOPIC_QUERY} ${q}`.trim(),
    sort: sort === "stars" ? "stars" : "updated",
    order: "desc",
    per_page: String(PER_PAGE),
    page: String(page)
  });
  const response = await httpFetch(`${GITHUB_SEARCH}?${params}`, {
    headers: { "user-agent": USER_AGENT, accept: "application/vnd.github+json" },
    signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) {
    const err = new Error(`GitHub API HTTP ${response.status}`);
    err.status = response.status;
    throw err;
  }
  const body = await response.json();
  return {
    total: body.total_count ?? 0,
    items: (body.items ?? []).map(normalizeRepo),
    incomplete: body.incomplete_results === true
  };
}

/** 读取磁盘缓存的单页（含 TTL 判定）。 */
function readCachedPage(cache, key, now) {
  const entry = cache.repos?.[key];
  if (entry === void 0) return void 0;
  if (now - entry.fetchedAt > CACHE_TTL_MS) return { ...entry, stale: true };
  return { ...entry, stale: false };
}

/** 写回单页缓存。 */
function writeCachedPage(cache, key, payload, now) {
  if (cache.repos === void 0) cache.repos = {};
  cache.repos[key] = { fetchedAt: now, ...payload };
}

/**
 * 取得一页目录：缓存优先，未命中/过期时拉 GitHub，失败时降级返回缓存。
 * @param ctx - 插件上下文。
 * @param q - 搜索词（可空）。
 * @param sort - `updated` 或 `stars`。
 * @param page - 页码（从 1 起）。
 * @returns 目录页对象。
 */
async function getPage(ctx, q, sort, page) {
  const home = resolveHome(ctx);
  const cache = readDiskCache(home);
  const now = Date.now();
  const key = `list:${q}:${sort}:${page}`;
  const cached = readCachedPage(cache, key, now);
  if (cached !== void 0 && !cached.stale) return { ...cached, cached: true };
  try {
    const fresh = await fetchGitHubPage(q, sort, page);
    writeCachedPage(cache, key, fresh, now);
    writeDiskCache(home, cache);
    return { ...fresh, cached: false };
  } catch (error) {
    if (cached !== void 0) return { ...cached, cached: true, degraded: true };
    throw error;
  }
}

/** 后台预热：拉"最新更新"前几页写入缓存。 */
async function prewarm(ctx, cache, now) {
  try {
    for (let page = 1; page <= PREWARM_PAGES; page += 1) {
      const key = `list::updated:${page}`;
      const existing = readCachedPage(cache, key, now);
      if (existing !== void 0 && !existing.stale) continue;
      const fresh = await fetchGitHubPage("", "updated", page);
      writeCachedPage(cache, key, fresh, now);
    }
    writeDiskCache(resolveHome(ctx), cache);
  } catch {}
}

/** 读取当前 profile 已安装的第三方插件（dependencies 中非内置包）。 */
function readInstalled(ctx) {
  const manifestPath = new URL("package.json", ctx.baseUrl);
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    const deps = Object.keys(manifest.dependencies ?? {}).filter((pkg) => !pkg.startsWith("@deepseek-ai/") && pkg !== "dsh-plugin-desktop").sort();
    return deps;
  } catch {
    return [];
  }
}

/** 探测仓库根的 package.json（raw.githubusercontent.com，不占 API 配额）。 */
async function probePackageJson(owner, repo, branch) {
  const url = `${GITHUB_RAW}/${owner}/${repo}/${encodeURIComponent(branch)}/package.json`;
  const response = await httpFetch(url, {
    headers: { "user-agent": USER_AGENT },
    signal: AbortSignal.timeout(15000)
  });
  if (response.status === 404) return null;
  if (!response.ok) return null;
  try {
    const manifest = await response.json();
    return manifest !== null && typeof manifest === "object" ? manifest : null;
  } catch {
    return null;
  }
}

/** 判断 npm 上是否已发布该包。 */
async function npmPublished(packageName) {
  try {
    const encoded = packageName.startsWith("@")
      ? `${encodeURIComponent(packageName.split("/")[0])}/${packageName.split("/")[1]}`
      : packageName;
    const response = await httpFetch(`${NPM_REGISTRY}/${encoded}/latest`, {
      headers: { "user-agent": USER_AGENT },
      signal: AbortSignal.timeout(10000)
    });
    return response.ok;
  } catch {
    return false;
  }
}

/** 本机是否有 git（安装 git 仓库需要）。 */
function hasGit() {
  try {
    const result = spawnSync("git", ["--version"], { stdio: "ignore", timeout: 5000 });
    return result.error === void 0 && result.status === 0;
  } catch {
    return false;
  }
}

/**
 * 从仓库信息构造安装 spec 并执行 `dsh plugin add`。
 * @param ctx - 插件上下文。
 * @param owner - 仓库属主。
 * @param repo - 仓库名。
 * @param branch - 默认分支。
 * @returns 安装结果对象。
 */
async function installFromRepo(ctx, owner, repo, branch) {
  if (!GITHUB_NAME.test(owner) || !GITHUB_NAME.test(repo)) {
    return { ok: false, message: "非法的仓库名" };
  }
  const manifest = await probePackageJson(owner, repo, branch);
  let spec;
  let mode = "git";
  if (manifest !== null && typeof manifest.name === "string" && NPM_NAME.test(manifest.name)) {
    const published = await npmPublished(manifest.name);
    if (published) {
      spec = `${manifest.name}@latest`;
      mode = "npm";
    }
  }
  if (spec === void 0) {
    if (!hasGit()) {
      return {
        ok: false,
        mode: "git",
        message: "该插件未发布到 npm，需要从 Git 仓库安装，但本机没有 Git。请先安装 Git（例如在终端运行 `winget install Git.Git`），然后重试。"
      };
    }
    spec = `git+https://github.com/${owner}/${repo}.git`;
  }
  const profileDir = fileURLToPath(new URL(".", ctx.baseUrl));
  let child;
  try {
    const desktopPnpm = ctx.get("desktopPnpm");
    if (desktopPnpm === void 0 || typeof desktopPnpm.runPlugin !== "function") {
      return { ok: false, message: "当前部署没有可用的 pnpm 安装通道（仅桌面端支持一键安装）。" };
    }
    child = desktopPnpm.runPlugin(["add", spec], profileDir);
  } catch (error) {
    return { ok: false, message: `启动安装失败：${error instanceof Error ? error.message : String(error)}` };
  }
  const output = [];
  const collect = async (stream) => {
    try {
      if (stream === void 0) return;
      for await (const chunk of stream) output.push(String(chunk));
    } catch {}
  };
  await Promise.all([collect(child.stdout), collect(child.stderr)]);
  const outcome = await child.done.catch(() => ({ exitCode: -1, signal: null }));
  if (outcome.exitCode === 0) {
    return {
      ok: true,
      mode,
      spec,
      needsRestart: true,
      message: `安装成功：${spec}。需要重启 DSH Desktop 后生效。`
    };
  }
  const tail = output.join("").split(/\r?\n/).filter((line) => line.length > 0).slice(-6).join("\n");
  return {
    ok: false,
    mode,
    spec,
    message: `安装失败（pnpm 退出码 ${String(outcome.exitCode)}）。\n${tail || "无输出"}`.slice(0, 800)
  };
}

/** 解析 JSON 请求体。 */
async function readJsonBody(req) {
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
function sendJson(res, status, body) {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "content-length": Buffer.byteLength(text)
  });
  res.end(text);
}

/**
 * 安装插件：注册路由 + 后台预热定时器。
 * @param ctx - 插件上下文（已注入 webServer 与 loader）。
 */
function apply(ctx) {
  ctx.effect(() => {
    const disposers = [];

    disposers.push(ctx.webServer.register({
      kind: "exact",
      path: "/plugin-market/list",
      handler: async (req, res) => {
        try {
          const url = new URL(req.url ?? "/", "http://dsh.internal");
          const q = (url.searchParams.get("q") ?? "").trim();
          const sort = url.searchParams.get("sort") === "stars" ? "stars" : "updated";
          const page = Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1);
          const payload = await getPage(ctx, q, sort, page);
          sendJson(res, 200, { ok: true, ...payload });
        } catch (error) {
          const status = error instanceof Error && error.status !== void 0 ? error.status : 502;
          const rateLimited = status === 403 || status === 429;
          sendJson(res, status, {
            ok: false,
            message: rateLimited
              ? "GitHub 接口触发了速率限制，请稍后重试（已缓存的内容不受影响）。"
              : `获取目录失败：${error instanceof Error ? error.message : String(error)}`
          });
        }
      }
    }), "market: list route");

    disposers.push(ctx.webServer.register({
      kind: "exact",
      path: "/plugin-market/installed",
      handler: (_req, res) => {
        sendJson(res, 200, { ok: true, installed: readInstalled(ctx) });
      }
    }), "market: installed route");

    disposers.push(ctx.webServer.register({
      kind: "exact",
      path: "/plugin-market/install",
      handler: async (req, res) => {
        try {
          const body = await readJsonBody(req);
          if (body === null || typeof body.owner !== "string" || typeof body.repo !== "string") {
            sendJson(res, 400, { ok: false, message: "请求体需要 { owner, repo, branch? }" });
            return;
          }
          const branch = typeof body.branch === "string" && body.branch.length > 0 ? body.branch : "main";
          const result = await installFromRepo(ctx, body.owner, body.repo, branch);
          sendJson(res, result.ok ? 200 : 422, { ok: result.ok, ...result });
        } catch (error) {
          sendJson(res, 502, {
            ok: false,
            message: `安装流程出错：${error instanceof Error ? error.message : String(error)}`
          });
        }
      }
    }), "market: install route");

    disposers.push(ctx.webServer.register({
      kind: "exact",
      path: "/plugin-market/restart",
      handler: (_req, res) => {
        const runtime = ctx.get("desktopRuntime");
        if (runtime === void 0 || typeof runtime.requestRestart !== "function") {
          sendJson(res, 422, { ok: false, message: "当前部署不支持自动重启，请手动重启 DSH Desktop。" });
          return;
        }
        sendJson(res, 200, { ok: true, message: "正在重启…" });
        void Promise.resolve().then(() => runtime.requestRestart());
      }
    }), "market: restart route");

    const timer = setInterval(() => {
      void prewarm(ctx, readDiskCache(resolveHome(ctx)), Date.now());
    }, PREWARM_INTERVAL_MS);

    // 首次启动即预热一次（不阻塞加载）。
    void prewarm(ctx, readDiskCache(resolveHome(ctx)), Date.now());

    return () => {
      for (const disposer of disposers) disposer();
      clearInterval(timer);
    };
  }, "dsh-plugin-market: routes + prewarm");
}

export { apply, inject, name };
