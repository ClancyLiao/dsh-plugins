window.__ModuleLoader__.load({
	id: "dsh-client-ui-github-market",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		let _primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region styles
		const css = ".mkt_section{width:100%;max-width:760px;color:var(--dsw-alias-label-primary);flex-direction:column;gap:14px;display:flex}.mkt_status,.mkt_failure p{margin:0}.mkt_status{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px}.mkt_failure{color:var(--dsw-alias-state-error-primary);align-items:flex-start;gap:10px;display:flex;flex-direction:column}.mkt_failure button{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary);font:inherit;cursor:pointer;background:0 0;border-radius:6px;padding:4px 10px}.mkt_toolbar{align-items:center;gap:8px;display:flex}.mkt_search{width:100%;color:var(--dsw-alias-label-tertiary);align-items:center;display:flex;position:relative;flex:1}.mkt_search>svg{pointer-events:none;position:absolute;left:12px}.mkt_search input{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);width:100%;height:36px;color:var(--dsw-alias-label-primary);font:inherit;border-radius:8px;outline:none;padding:0 34px 0 36px;font-size:13px}.mkt_search input::placeholder{color:var(--dsw-alias-label-tertiary)}.mkt_search input:focus-visible{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-state-business-primary) 18%,transparent)}.mkt_sort{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);height:36px;color:var(--dsw-alias-label-primary);font:inherit;border-radius:8px;padding:0 8px;font-size:13px}.mkt_heading{align-items:baseline;gap:7px;padding:0 2px;display:flex}.mkt_heading h3{margin:0;font-size:13px;font-weight:600;line-height:20px}.mkt_heading span{color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums;font-size:12px;line-height:18px}.mkt_cards{flex-direction:column;gap:10px;margin:0;padding:0;list-style:none;display:flex}.mkt_card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:10px;min-width:0;padding:10px 12px;gap:6px;display:flex;flex-direction:column}.mkt_cardHead{align-items:flex-start;gap:8px;display:flex}.mkt_cardTitle{color:var(--dsw-alias-label-primary);font-size:13px;font-weight:600;line-height:20px;margin:0;word-break:break-word;flex:1;min-width:0}.mkt_cardTitle a{color:inherit;text-decoration:none}.mkt_cardTitle a:hover{text-decoration:underline}.mkt_badge{white-space:nowrap;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);border-radius:999px;padding:1px 8px;font-size:11px;font-weight:500;line-height:17px;flex:none}.mkt_badgeInstalled{background:var(--dsw-alias-state-success-secondary,var(--dsw-alias-bg-module-platform));color:var(--dsw-alias-state-success-primary)}.mkt_desc{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;margin:0;word-break:break-word;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.mkt_meta{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;gap:10px;display:flex;flex-wrap:wrap}.mkt_actions{align-items:center;gap:8px;display:flex}.mkt_install{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;cursor:pointer;border-radius:6px;padding:4px 12px;font-size:12px;line-height:18px}.mkt_install:hover:not(:disabled){border-color:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-state-business-primary)}.mkt_install:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}.mkt_installDone{color:var(--dsw-alias-state-success-primary);border-color:var(--dsw-alias-state-success-primary)}.mkt_result{margin:0;font-size:12px;line-height:18px;word-break:break-word;white-space:pre-wrap}.mkt_resultOk{color:var(--dsw-alias-state-success-primary)}.mkt_resultErr{color:var(--dsw-alias-state-error-primary)}.mkt_more{align-self:center;border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary);font:inherit;cursor:pointer;background:0 0;border-radius:8px;padding:6px 16px;font-size:13px}.mkt_more:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}";
		const tagId = "dsh-client-ui-github-market/styles";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-client-ui-github-market";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		const styles = {
			section: "mkt_section",
			status: "mkt_status",
			failure: "mkt_failure",
			toolbar: "mkt_toolbar",
			search: "mkt_search",
			sort: "mkt_sort",
			heading: "mkt_heading",
			cards: "mkt_cards",
			card: "mkt_card",
			cardHead: "mkt_cardHead",
			cardTitle: "mkt_cardTitle",
			badge: "mkt_badge",
			badgeInstalled: "mkt_badgeInstalled",
			desc: "mkt_desc",
			meta: "mkt_meta",
			actions: "mkt_actions",
			install: "mkt_install",
			installDone: "mkt_installDone",
			result: "mkt_result",
			resultOk: "mkt_resultOk",
			resultErr: "mkt_resultErr",
			more: "mkt_more"
		};
		//#endregion
		//#region api
		async function api(path, init) {
			const response = await fetch(path, init);
			let body = {};
			try {
				body = await response.json();
			} catch {}
			if (!response.ok || body.ok === false) {
				const err = new Error(body.message !== void 0 && body.message !== "" ? body.message : `HTTP ${response.status}`);
				err.status = response.status;
				throw err;
			}
			return body;
		}
		const installedKey = (fullName) => `market-installed:${fullName}`;
		function localInstalled(fullName) {
			try {
				return localStorage.getItem(installedKey(fullName));
			} catch {
				return null;
			}
		}
		function markInstalled(fullName, spec) {
			try {
				localStorage.setItem(installedKey(fullName), spec);
			} catch {}
		}
		function shortDate(value) {
			if (!value) return "";
			const date = new Date(value);
			if (Number.isNaN(date.getTime())) return value;
			return date.toLocaleDateString(void 0, { year: "numeric", month: "2-digit", day: "2-digit" });
		}
		function starsLabel(count) {
			return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count);
		}
		//#endregion
		//#region component
		/**
		* MarketTab：GitHub dsh-plugin topic 插件市场。
		* @param props - `t`（字典绑定）。
		*/
		function MarketTab(props) {
			const { t } = props;
			const [state, setState] = react.useState({ status: "loading" });
			const [q, setQ] = react.useState("");
			const [sort, setSort] = react.useState("updated");
			const [busy, setBusy] = react.useState(null);
			const [results, setResults] = react.useState({});
			const jsx = react_jsx_runtime.jsx;
			const jsxs = react_jsx_runtime.jsxs;
			const load = react.useCallback(async (reset) => {
				if (reset) setState((prev) => ({ ...prev, status: "loading" }));
				try {
					const body = await api(`/plugin-market/list?q=${encodeURIComponent(q)}&sort=${sort}&page=1`);
					setState({ status: "ready", items: body.items, total: body.total, page: 1, cached: body.cached === true, degraded: body.degraded === true, error: null });
				} catch (error) {
					setState({ status: "error", error: error instanceof Error ? error.message : String(error) });
				}
			}, [q, sort]);
			react.useEffect(() => {
				const timer = setTimeout(() => {
					void load(true);
				}, 300);
				return () => clearTimeout(timer);
			}, [load]);
			const loadMore = async () => {
				if (state.status !== "ready" || busy !== null) return;
				setBusy("more");
				try {
					const body = await api(`/plugin-market/list?q=${encodeURIComponent(q)}&sort=${sort}&page=${state.page + 1}`);
					setState((prev) => ({ ...prev, items: [...prev.items, ...body.items], total: body.total, page: body.page }));
				} catch (error) {
					setResults((prev) => ({ ...prev, more: error instanceof Error ? error.message : String(error) }));
				} finally {
					setBusy(null);
				}
			};
			const install = async (repo) => {
				if (busy !== null) return;
				const confirmed = window.confirm(`${t("confirm1")}\n\n${repo.fullName}\n\n${t("confirm2")}`);
				if (!confirmed) return;
				setBusy(repo.fullName);
				setResults((prev) => ({ ...prev, [repo.fullName]: null }));
				try {
					const body = await api("/plugin-market/install", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({ owner: repo.owner, repo: repo.repo, branch: repo.branch })
					});
					if (body.ok) markInstalled(repo.fullName, body.spec ?? "");
					setResults((prev) => ({ ...prev, [repo.fullName]: { ok: body.ok === true, message: body.message } }));
				} catch (error) {
					setResults((prev) => ({ ...prev, [repo.fullName]: { ok: false, message: error instanceof Error ? error.message : String(error) } }));
				} finally {
					setBusy(null);
				}
			};
			const restart = async () => {
				try {
					await api("/plugin-market/restart", { method: "POST" });
				} catch (error) {
					setResults((prev) => ({ ...prev, restart: error instanceof Error ? error.message : String(error) }));
				}
			};
			const hasMore = state.status === "ready" && state.items.length < state.total;
			return jsxs("div", {
				className: styles.section,
				"aria-busy": state.status === "loading",
				children: [
					jsxs("div", {
						className: styles.toolbar,
						children: [
							jsxs("label", {
								className: styles.search,
								children: [
									jsx(_primitives.IconSearchOutline16, { "aria-hidden": "true" }),
									jsx("input", {
										type: "search",
										value: q,
										placeholder: t("search"),
										"aria-label": t("search"),
										onChange: (event) => {
											setQ(event.currentTarget.value);
										}
									})
								]
							}),
							jsx("select", {
								className: styles.sort,
								value: sort,
								"aria-label": t("sort"),
								onChange: (event) => {
									setSort(event.currentTarget.value);
								},
								children: [
									jsx("option", { value: "updated", children: t("sortUpdated") }),
									jsx("option", { value: "stars", children: t("sortStars") })
								]
							})
						]
					}),
					state.status === "loading" ? jsx("p", { className: styles.status, children: t("loading") }) : null,
					state.status === "error" ? jsxs("div", {
						className: styles.failure,
						children: [
							jsx("p", { role: "alert", children: state.error ?? t("error") }),
							jsx("button", { type: "button", onClick: () => void load(true), children: t("retry") })
						]
					}) : null,
					state.status === "ready" ? jsxs(react.Fragment, {
						children: [
							jsxs("div", {
								className: styles.heading,
								children: [
									jsx("h3", { children: t("catalog") }),
									jsx("span", { children: `${state.total}${state.cached ? " · " + t("cached") : ""}${state.degraded ? " · " + t("degraded") : ""}` })
								]
							}),
							state.items.length === 0 ? jsx("p", { className: styles.status, children: t("empty") }) : jsx("ul", {
								className: styles.cards,
								children: state.items.map((repo) => {
									const installed = localInstalled(repo.fullName);
									const result = results[repo.fullName];
									const working = busy === repo.fullName;
									return jsxs("li", {
										className: styles.card,
										"data-plugin-repo": repo.fullName,
										children: [
											jsxs("div", {
												className: styles.cardHead,
												children: [
													jsx("strong", {
														className: styles.cardTitle,
														children: jsx("a", { href: repo.htmlUrl, target: "_blank", rel: "noreferrer", children: repo.fullName })
													}),
													installed !== null ? jsx("span", { className: `${styles.badge} ${styles.badgeInstalled}`, children: t("installed") }) : null,
													jsx("span", { className: styles.badge, children: `★ ${starsLabel(repo.stars)}` }),
													repo.language !== "" ? jsx("span", { className: styles.badge, children: repo.language }) : null
												]
											}),
											repo.description !== "" ? jsx("p", { className: styles.desc, children: repo.description }) : null,
											jsx("div", {
												className: styles.meta,
												children: [
													jsx("span", { children: `${t("updated")} ${shortDate(repo.updatedAt)}` }),
													jsx("span", { children: repo.branch })
												]
											}),
											jsxs("div", {
												className: styles.actions,
												children: [
													jsx("button", {
														className: installed !== null ? `${styles.install} ${styles.installDone}` : styles.install,
														type: "button",
														disabled: working || busy !== null,
														onClick: () => void install(repo),
														children: working ? t("installing") : installed !== null ? t("installedAction") : t("install")
													}),
													result !== void 0 && result !== null ? jsx("p", {
														className: `${styles.result} ${result.ok ? styles.resultOk : styles.resultErr}`,
														children: result.message
													}) : null,
													result !== void 0 && result !== null && result.ok ? jsx("button", {
														className: styles.install,
														type: "button",
														onClick: () => void restart(),
														children: t("restart")
													}) : null
												]
											})
										]
									}, repo.fullName);
								})
							}),
							hasMore ? jsx("button", {
								className: styles.more,
								type: "button",
								disabled: busy !== null,
								onClick: () => void loadMore(),
								children: busy === "more" ? t("loadingMore") : t("loadMore")
							}) : null,
							results.restart !== void 0 ? jsx("p", { className: `${styles.result} ${styles.resultErr}`, children: results.restart }) : null
						]
					}) : null
				]
			});
		}
		//#endregion
		//#region locales
		const NS = "settings.pluginMarket";
		const zh = {
			tab: "插件市场",
			loading: "正在加载插件市场…",
			error: "暂时无法加载插件市场。",
			retry: "重试",
			search: "搜索插件市场（GitHub dsh-plugin）",
			sort: "排序方式",
			sortUpdated: "最新更新",
			sortStars: "最多 Star",
			catalog: "插件市场",
			cached: "缓存",
			degraded: "降级（GitHub 暂不可用，显示缓存）",
			empty: "没有匹配的插件。",
			loadMore: "加载更多",
			loadingMore: "加载中…",
			install: "安装",
			installing: "安装中…",
			installed: "已安装",
			installedAction: "已安装（需重启）",
			restart: "立即重启",
			updated: "更新于",
			confirm1: "确定要安装这个插件吗？",
			confirm2: "第三方插件会在你的设备上执行代码，请确认来源可信后再安装。安装完成后需要重启 DSH Desktop 才会生效。"
		};
		const en = {
			tab: "Plugin Market",
			loading: "Loading plugin market…",
			error: "Plugin market is temporarily unavailable.",
			retry: "Retry",
			search: "Search the GitHub dsh-plugin topic",
			sort: "Sort by",
			sortUpdated: "Recently updated",
			sortStars: "Most stars",
			catalog: "Plugin market",
			cached: "cached",
			degraded: "degraded (GitHub unreachable, showing cache)",
			empty: "No matching plugins.",
			loadMore: "Load more",
			loadingMore: "Loading…",
			install: "Install",
			installing: "Installing…",
			installed: "Installed",
			installedAction: "Installed (restart needed)",
			restart: "Restart now",
			updated: "Updated",
			confirm1: "Install this plugin?",
			confirm2: "Third-party plugins execute code on your device. Only install from sources you trust. DSH Desktop needs a restart for the plugin to take effect."
		};
		//#endregion
		//#region apply
		const inject = ["slots", "locale"];
		/** 注册"插件市场"tab（与"插件列表"并存，id 为 market）。 */
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-plugin-market: dictionaries");
			const t = ctx.locale.bind(NS);
			ctx.slots.inject("settings.plugins.tab", () => ctx.slots.register({
				name: "settings.plugins.tab",
				id: "market",
				order: 20,
				label: () => t("tab"),
				locale: NS
			}, MarketTab));
		}
		//#endregion
		exports.NS = NS;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
