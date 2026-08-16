import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

/**
 * dsh-plugin-inventory-notes
 *
 * 为插件清单界面提供每个插件的简介：注册一个 HTTP 路由 `/plugin-notes.json`，
 * 返回 `{ notes: { [moduleName]: { zh?, en? } } }`。
 *
 * 简介来源：
 * - 中文（zh）：优先从包的 `README.zh.md` 提取第一段正文摘要；
 * - 英文（en）：包的 `package.json` 的 `description`。
 *
 * 包目录按 Node 模块解析规则从当前 profile 目录解析，因此任何已安装插件
 * （内置 @deepseek-ai 包、dsh-plugin-desktop、用户插件）都能拿到简介。
 */

/** 稳定 Cordis 插件名。 */
const name = "inventory-notes";

/** 需要 loader（枚举插件行）与 webServer（注册路由）。 */
const inject = ["loader", "webServer"];

/** 中文摘要截断长度（字符）。 */
const ZH_INTRO_MAX = 160;

/**
 * 从 loader 模块名拆出包名（去掉子路径）；`cordis:` 内建名返回 null。
 * @param specifier - loader 行的 name，如 `@deepseek-ai/dsh-web-app/startup`。
 * @returns 包名，或 null（内建/无法拆分）。
 */
function packageNameOf(specifier) {
  if (typeof specifier !== "string") return null;
  if (specifier.startsWith("cordis:")) return null;
  if (specifier.startsWith("@")) {
    const parts = specifier.split("/");
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : null;
  }
  return specifier.split("/")[0];
}

/**
 * 按 Node 解析规则从锚点出发查找包目录（与 dsh-app-boot 的
 * packageDirFromAnchor 同一套搜索路径）。
 * @param anchorFile - 锚点 package.json 的绝对路径。
 * @param pkg - 包名。
 * @returns 包根目录绝对路径，找不到返回 null。
 */
function packageDirFromAnchor(anchorFile, pkg) {
  const require = createRequire(anchorFile);
  for (const searchPath of require.resolve.paths(pkg) ?? []) {
    const candidate = join(searchPath, pkg);
    if (existsSync(join(candidate, "package.json"))) return candidate;
  }
  return null;
}

/** 跳过 README 中无信息量的行：标题、图片、纯链接、语言切换行、代码围栏。 */
function isNoiseLine(line) {
  if (/^#/.test(line)) return true;
  if (/^!\[/.test(line)) return true;
  if (/^```/.test(line)) return true;
  if (/^\|/.test(line)) return true;
  if (/^\[[^\]]*\]\([^)]*\)\s*$/.test(line)) return true;
  // 语言切换行：`[English](README.md) | 中文`
  if (/^\[[^\]]*\]\([^)]*\)\s*\|/.test(line)) return true;
  return false;
}

/** 轻量清理 markdown 记号：链接 → 文本，去掉强调/行内代码符号。 */
function cleanupMarkdown(text) {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 从 README.zh.md 提取第一段正文作为中文简介。
 * @param text - 文件全文。
 * @returns 摘要字符串（可能为空）。
 */
function extractZhIntro(text) {
  const buf = [];
  let sawContent = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (line.length === 0) {
      if (sawContent) break;
      continue;
    }
    if (isNoiseLine(line)) continue;
    sawContent = true;
    buf.push(line);
    if (buf.join(" ").length >= ZH_INTRO_MAX) break;
  }
  let s = buf.join(" ").replace(/\s+/g, " ").trim();
  s = cleanupMarkdown(s);
  if (s.length > 200) s = `${s.slice(0, 197)}…`;
  return s;
}

/**
 * 收集一个包的简介。
 * @param pkg - 包名。
 * @param anchorFile - profile 目录下 package.json 的绝对路径（解析锚点）。
 * @returns `{ zh?, en? }`，两者都拿不到时返回 null。
 */
function noteFor(pkg, anchorFile) {
  const dir = packageDirFromAnchor(anchorFile, pkg);
  if (dir === null) return null;
  let en;
  let zh;
  try {
    const manifest = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
    if (typeof manifest.description === "string" && manifest.description.length > 0) en = manifest.description;
  } catch {}
  try {
    const zhPath = join(dir, "README.zh.md");
    if (existsSync(zhPath)) {
      const intro = extractZhIntro(readFileSync(zhPath, "utf8"));
      if (intro.length > 0) zh = intro;
    }
  } catch {}
  if (zh === void 0 && en === void 0) return null;
  return {
    ...zh !== void 0 ? { zh } : {},
    ...en !== void 0 ? { en } : {}
  };
}

/**
 * 遍历 loader 当前全部非 group 行，构建 moduleName → 简介 的映射。
 * 同一包名只解析一次（同一包的多行共享结果）。
 * @param ctx - 插件上下文。
 * @returns notes 映射。
 */
function collectNotes(ctx) {
  const anchorFile = fileURLToPath(new URL("package.json", ctx.baseUrl));
  const notes = {};
  const cache = new Map();
  for (const entry of ctx.loader.entries()) {
    if (entry.options.group) continue;
    const moduleName = entry.options?.name;
    const pkg = packageNameOf(moduleName);
    if (pkg === null) continue;
    let note = cache.get(pkg);
    if (note === void 0) {
      note = noteFor(pkg, anchorFile);
      cache.set(pkg, note);
    }
    if (note !== null) notes[moduleName] = note;
  }
  return notes;
}

/**
 * 安装插件：注册 `/plugin-notes.json` 路由。
 * @param ctx - 插件上下文（已注入 loader 与 webServer 服务）。
 */
function apply(ctx) {
  ctx.effect(() => {
    const disposer = ctx.webServer.register({
      kind: "exact",
      path: "/plugin-notes.json",
      handler: (_req, res) => {
        res.writeHead(200, {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store"
        });
        res.end(JSON.stringify({ notes: collectNotes(ctx) }));
      }
    });
    return disposer;
  }, "inventory-notes: /plugin-notes.json route");
}

export { apply, inject, name };
