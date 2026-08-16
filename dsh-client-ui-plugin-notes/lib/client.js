window.__ModuleLoader__.load({
	id: "dsh-client-ui-plugin-notes",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		let _primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region styles
		const css = ".pn_section{width:100%;max-width:760px;color:var(--dsw-alias-label-primary);flex-direction:column;gap:14px;display:flex}.pn_catalogHeading h3,.pn_status,.pn_failure p{margin:0}.pn_status,.pn_failure{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px}.pn_failure{color:var(--dsw-alias-state-error-primary);align-items:center;gap:10px;display:flex}.pn_failure button{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary);font:inherit;cursor:pointer;background:0 0;border-radius:6px;padding:4px 10px}.pn_search{width:100%;color:var(--dsw-alias-label-tertiary);align-items:center;display:flex;position:relative}.pn_search>svg{pointer-events:none;position:absolute;left:12px}.pn_search input{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);width:100%;height:36px;color:var(--dsw-alias-label-primary);font:inherit;border-radius:8px;outline:none;padding:0 34px 0 36px;font-size:13px}.pn_search input::placeholder{color:var(--dsw-alias-label-tertiary)}.pn_search input:focus-visible{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-state-business-primary) 18%,transparent)}.pn_catalogHeading{align-items:baseline;gap:7px;padding:0 2px;display:flex}.pn_catalogHeading h3{font-size:13px;font-weight:600;line-height:20px}.pn_catalogHeading span{color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums;font-size:12px;line-height:18px}.pn_cards{grid-template-columns:repeat(2,minmax(0,1fr));align-items:start;gap:10px;margin:0;padding:0;list-style:none;display:grid}.pn_card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:10px;min-width:0;overflow:hidden}.pn_card[data-open=true]{border-color:var(--dsw-alias-border-l1);box-shadow:var(--dsw-shadow-lv1)}.pn_cardContent{width:100%;text-align:left;font:inherit;color:inherit;background:0 0;border:0;cursor:pointer;gap:6px;padding:10px 12px;display:flex;flex-direction:column}.pn_cardTitle{color:var(--dsw-alias-label-primary);font-size:13px;font-weight:600;line-height:20px;margin:0;word-break:break-word}.pn_cardDesc{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;margin:0;word-break:break-word;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.pn_cardTrailing{align-items:center;gap:6px;display:flex}.pn_statusDot{width:8px;height:8px;border-radius:50%;flex:none;background:var(--dsw-alias-label-tertiary)}.pn_statusDot[data-phase=active]{background:var(--dsw-alias-state-success-primary)}.pn_statusDot[data-phase=failed]{background:var(--dsw-alias-state-error-primary)}.pn_statusDot[data-phase=loading],.pn_statusDot[data-phase=pending]{background:var(--dsw-alias-state-warn-primary)}.pn_tag{white-space:nowrap;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);border-radius:999px;padding:1px 8px;font-size:11px;font-weight:500;line-height:17px}.pn_chevron{margin-left:auto;color:var(--dsw-alias-label-caption);flex:none;transition:transform .12s}.pn_chevronOpen{transform:rotate(180deg)}.pn_details{border-top:1px solid var(--dsw-alias-border-l2);gap:8px;padding:8px 12px 12px;display:flex;flex-direction:column}.pn_entryValue{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);border-radius:6px;padding:2px 8px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:18px;display:block}.pn_details dl{margin:0;flex-direction:column;gap:4px;display:flex}.pn_details dl>div{display:flex;gap:8px;font-size:12px;line-height:18px}.pn_details dt{color:var(--dsw-alias-label-tertiary);flex:none;margin:0}.pn_details dd{color:var(--dsw-alias-label-primary);margin:0;min-width:0;word-break:break-word}";
		const tagId = "dsh-client-ui-plugin-notes/styles";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-client-ui-plugin-notes";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		const styles = {
			section: "pn_section",
			status: "pn_status",
			failure: "pn_failure",
			search: "pn_search",
			catalogHeading: "pn_catalogHeading",
			cards: "pn_cards",
			card: "pn_card",
			cardContent: "pn_cardContent",
			cardTitle: "pn_cardTitle",
			cardDesc: "pn_cardDesc",
			cardTrailing: "pn_cardTrailing",
			statusDot: "pn_statusDot",
			tag: "pn_tag",
			chevron: "pn_chevron",
			chevronOpen: "pn_chevronOpen",
			details: "pn_details",
			entryValue: "pn_entryValue"
		};
		//#endregion
		//#region component
		const PHASE_KEYS = {
			pending: "pending",
			loading: "loadingPhase",
			active: "active",
			failed: "failed",
			unloading: "unloading"
		};
		function phaseLabel(phase, t) {
			return phase === null ? t("unobserved") : t(PHASE_KEYS[phase]);
		}
		function moduleShortName(moduleName) {
			return (moduleName.startsWith("@") ? moduleName.slice(moduleName.indexOf("/") + 1) : moduleName).replace(/^cordis:/, "").replace(/^cordis-plugin-/, "").replace(/^dsh-(?:host-|client-)?/, "");
		}
		/**
		* PluginNotesTab：增强版插件列表 —— 每个插件卡片直接显示一句话简介。
		* @param props - `list`（插件清单）、`notes`（简介数据）、`t`（字典绑定）。
		*/
		function PluginNotesTab(props) {
			const { list, notes, t } = props;
			const [request, setRequest] = react.useState(0);
			const [query, setQuery] = react.useState("");
			const [expanded, setExpanded] = react.useState(null);
			const [state, setState] = react.useState({ status: "loading" });
			react.useEffect(() => {
				let current = true;
				Promise.resolve().then(() => Promise.all([list(), notes()])).then(([snapshot, notesPayload]) => {
					if (!current) return;
					setState({
						status: "ready",
						snapshot,
						notes: notesPayload !== null && typeof notesPayload === "object" && notesPayload.notes !== void 0 ? notesPayload.notes : {}
					});
				}, () => {
					if (current) setState({ status: "error" });
				});
				return () => {
					current = false;
				};
			}, [list, notes, request]);
			const normalizedQuery = query.trim().toLocaleLowerCase();
			const filteredEntries = react.useMemo(() => {
				if (state.status !== "ready") return [];
				return state.snapshot.entries.filter((entry) => {
					if (normalizedQuery.length === 0) return true;
					const note = state.notes[entry.moduleName];
					const haystack = [entry.moduleName, entry.entryId, note === void 0 ? "" : note.zh ?? "", note === void 0 ? "" : note.en ?? ""].join(" ").toLocaleLowerCase();
					return haystack.includes(normalizedQuery);
				});
			}, [state, normalizedQuery]);
			const retry = () => {
				setState({ status: "loading" });
				setRequest((value) => value + 1);
			};
			const jsx = react_jsx_runtime.jsx;
			const jsxs = react_jsx_runtime.jsxs;
			return jsxs("div", {
				className: styles.section,
				"aria-busy": state.status === "loading",
				children: [
					state.status === "loading" ? jsx("p", { className: styles.status, children: t("loading") }) : null,
					state.status === "error" ? jsxs("div", {
						className: styles.failure,
						children: [
							jsx("p", { role: "alert", children: t("error") }),
							jsx("button", { type: "button", onClick: retry, children: t("retry") })
						]
					}) : null,
					state.status === "ready" ? jsxs(react.Fragment, {
						children: [
							jsxs("label", {
								className: styles.search,
								children: [
									jsx(_primitives.IconSearchOutline16, { "aria-hidden": "true" }),
									jsx("input", {
										type: "search",
										value: query,
										placeholder: t("search"),
										"aria-label": t("search"),
										onChange: (event) => {
											setQuery(event.currentTarget.value);
										}
									})
								]
							}),
							jsxs("div", {
								className: styles.catalogHeading,
								children: [
									jsx("h3", { children: t("catalog") }),
									jsx("span", { "data-plugin-count": filteredEntries.length, children: filteredEntries.length })
								]
							}),
							state.snapshot.entries.length === 0 ? jsx("p", { className: styles.status, children: t("empty") }) : null,
							state.snapshot.entries.length > 0 && filteredEntries.length === 0 ? jsx("p", { className: styles.status, children: t("emptySearch") }) : null,
							filteredEntries.length > 0 ? jsx("ul", {
								className: styles.cards,
								children: filteredEntries.map((entry) => {
									const status = phaseLabel(entry.fiberPhase, t);
									const title = moduleShortName(entry.moduleName);
									const configuration = t(entry.enabled ? "enabledTag" : "disabledTag");
									const note = state.notes[entry.moduleName];
									const desc = note !== void 0 && note.zh !== void 0 ? note.zh : note !== void 0 && note.en !== void 0 ? note.en : t("noNote");
									const open = expanded === entry.entryId;
									return jsxs("li", {
										className: styles.card,
										"data-plugin-entry": entry.entryId,
										"data-open": open ? "true" : void 0,
										children: [
											jsxs("button", {
												className: styles.cardContent,
												type: "button",
												"aria-expanded": open,
												"aria-label": `${title}: ${desc}`,
												onClick: () => {
													setExpanded((current) => current === entry.entryId ? null : entry.entryId);
												},
												children: [
													jsx("strong", { className: styles.cardTitle, title: entry.moduleName, children: title }),
													jsx("p", { className: styles.cardDesc, children: desc }),
													jsxs("span", {
														className: styles.cardTrailing,
														children: [
															entry.enabled ? jsx("span", {
																className: styles.statusDot,
																"data-phase": entry.fiberPhase ?? "unobserved",
																role: "img",
																"aria-label": status,
																title: status
															}) : null,
															jsx("span", { className: styles.tag, "data-enabled": entry.enabled ? "true" : "false", children: configuration }),
															jsx(_primitives.IconChevronDownOutline14, {
																className: open ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron,
																size: 12,
																"aria-hidden": "true"
															})
														]
													})
												]
											}),
											open ? jsxs("div", {
												className: styles.details,
												children: [
													jsx("code", { className: styles.entryValue, "data-loader-entry": true, children: entry.entryId }),
													jsxs("dl", {
														children: [
															jsxs("div", { children: [jsx("dt", { children: t("package") }), jsx("dd", { children: entry.moduleName })] }),
															note !== void 0 && note.en !== void 0 ? jsxs("div", { children: [jsx("dt", { children: t("description") }), jsx("dd", { children: note.en })] }) : null,
															jsxs("div", { children: [jsx("dt", { children: t("configuration") }), jsx("dd", { children: configuration })] }),
															entry.enabled ? jsxs("div", { children: [jsx("dt", { children: t("cordis") }), jsx("dd", { children: status })] }) : null
														]
													})
												]
											}) : null
										]
									}, entry.entryId);
								})
							}) : null
						]
					}) : null
				]
			});
		}
		//#endregion
		//#region locales
		const NS = "settings.pluginNotes";
		const zh = {
			tab: "插件列表",
			loading: "正在读取插件…",
			error: "暂时无法读取插件。",
			retry: "重试",
			search: "搜索插件",
			catalog: "插件列表",
			empty: "暂无插件。",
			emptySearch: "没有匹配的插件。",
			enabledTag: "已启用",
			disabledTag: "已停用",
			configuration: "配置状态",
			cordis: "Cordis 状态",
			unobserved: "未挂载",
			pending: "等待依赖",
			loadingPhase: "加载中",
			active: "已挂载",
			failed: "挂载失败",
			unloading: "卸载中",
			package: "包名",
			description: "英文描述",
			noNote: "（暂无简介）"
		};
		const en = {
			tab: "Plugin list",
			loading: "Reading plugins…",
			error: "Plugins are temporarily unavailable.",
			retry: "Retry",
			search: "Search plugins",
			catalog: "Plugin list",
			empty: "No plugins are available.",
			emptySearch: "No matching plugins.",
			enabledTag: "Enabled",
			disabledTag: "Disabled",
			configuration: "Configuration",
			cordis: "Cordis status",
			unobserved: "Not mounted",
			pending: "Waiting for dependencies",
			loadingPhase: "Loading",
			active: "Mounted",
			failed: "Mount failed",
			unloading: "Unloading",
			package: "Package",
			description: "Description",
			noNote: "(no summary available)"
		};
		//#endregion
		//#region apply
		const inject = [
			"slots",
			"locale",
			"remote",
			"remote.pluginInventory"
		];
		/** 注册增强版"插件列表"tab，shadow 内置同名 tab（同 id、更低 priority）。 */
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-plugin-notes: dictionaries");
			const t = ctx.locale.bind(NS);
			const list = async () => {
				const result = await ctx.remote.pluginInventory.list();
				if (!result.ok) throw new Error(`pluginInventory.list failed: ${result.error.code}: ${result.error.message}`);
				return result.value;
			};
			const notes = async () => {
				try {
					const response = await fetch("/plugin-notes.json", { cache: "no-store" });
					if (!response.ok) throw new Error(`plugin-notes.json: HTTP ${response.status}`);
					return await response.json();
				} catch {
					return { notes: {} };
				}
			};
			const injected = () => ({ list, notes });
			ctx.slots.inject("settings.plugins.tab", () => ctx.slots.register({
				name: "settings.plugins.tab",
				id: "all",
				priority: -1,
				order: 10,
				label: () => t("tab"),
				locale: NS,
				inject: injected
			}, PluginNotesTab));
		}
		//#endregion
		exports.NS = NS;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
