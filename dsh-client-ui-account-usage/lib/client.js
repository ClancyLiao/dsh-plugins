window.__ModuleLoader__.load({
	id: "dsh-client-ui-account-usage",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		//#region styles
		const css = ".au_root{color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:8px;width:100%;align-items:center;gap:6px;padding:4px 6px;font-size:12px;line-height:18px;display:flex;position:relative}.au_root:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}.au_root:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:-2px}.au_icon{flex:none;color:var(--dsw-alias-label-tertiary)}.au_label{min-width:0;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;font-variant-numeric:tabular-nums}.au_state{width:7px;height:7px;border-radius:50%;flex:none;background:var(--dsw-alias-state-warn-primary)}.au_stateOk{background:var(--dsw-alias-state-success-primary)}.au_stateErr{background:var(--dsw-alias-state-error-primary)}.au_panel{box-sizing:border-box;width:260px;background:var(--dsw-specific-menu);border:1px solid var(--dsw-alias-border-inverted);box-shadow:var(--dsw-shadow-lv3);color:var(--dsw-alias-label-primary);border-radius:12px;padding:10px;gap:8px;display:flex;flex-direction:column;position:absolute;bottom:calc(100% + 8px);left:0;z-index:30}.au_panelHead{align-items:center;gap:8px;display:flex}.au_panelTitle{margin:0;font-size:13px;font-weight:600;line-height:20px;flex:1}.au_statusBadge{border-radius:999px;padding:1px 8px;font-size:11px;line-height:17px;white-space:nowrap}.au_statusOk{background:var(--dsw-alias-state-success-secondary,var(--dsw-alias-bg-module-platform));color:var(--dsw-alias-state-success-primary)}.au_statusErr{background:var(--dsw-alias-interactive-bg-hover-danger);color:var(--dsw-alias-state-error-primary)}.au_row{justify-content:space-between;align-items:center;gap:8px;font-size:12px;line-height:18px;display:flex}.au_row dt{color:var(--dsw-alias-label-tertiary);margin:0}.au_row dd{margin:0;color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}.au_cur{color:var(--dsw-alias-label-primary);font-size:12px;font-weight:600;line-height:18px}.au_foot{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;display:flex;justify-content:space-between;align-items:center;gap:8px}.au_refresh{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);font:inherit;cursor:pointer;background:0 0;border-radius:6px;padding:2px 10px;font-size:11px;line-height:16px}.au_refresh:hover:not(:disabled){color:var(--dsw-alias-label-primary)}.au_refresh:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}.au_err{color:var(--dsw-alias-state-error-primary);font-size:11px;line-height:16px;margin:0;word-break:break-word}";
		const tagId = "dsh-client-ui-account-usage/styles";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-client-ui-account-usage";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		const styles = {
			root: "au_root",
			icon: "au_icon",
			label: "au_label",
			state: "au_state",
			stateOk: "au_stateOk",
			stateErr: "au_stateErr",
			panel: "au_panel",
			panelHead: "au_panelHead",
			panelTitle: "au_panelTitle",
			statusBadge: "au_statusBadge",
			statusOk: "au_statusOk",
			statusErr: "au_statusErr",
			row: "au_row",
			cur: "au_cur",
			foot: "au_foot",
			refresh: "au_refresh",
			err: "au_err"
		};
		//#endregion
		//#region component
		/** 钱包图标（内联 SVG）。 */
		function WalletIcon(props) {
			return react_jsx_runtime.jsx("svg", {
				width: 14,
				height: 14,
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": 2,
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				"aria-hidden": "true",
				...props,
				children: react_jsx_runtime.jsxs(react.Fragment, {
					children: [
						react_jsx_runtime.jsx("path", { d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" }),
						react_jsx_runtime.jsx("path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" })
					]
				})
			});
		}
		function formatMoney(value, currency) {
			const symbol = currency === "CNY" ? "¥" : `${currency} `;
			const n = Number.isFinite(value) ? value : 0;
			return `${symbol}${n.toFixed(2)}`;
		}
		function formatTime(ts) {
			if (ts === void 0) return "";
			const d = new Date(ts);
			if (Number.isNaN(d.getTime())) return "";
			return d.toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
		}
		/**
		* UsageBadge：侧边栏底部的余额徽标，点击展开明细。
		* @param props - `wide`（侧边栏展开态）与 `t`。
		*/
		function UsageBadge(props) {
			const { wide, t } = props;
			const [state, setState] = react.useState({ status: "loading" });
			const [open, setOpen] = react.useState(false);
			const [refreshing, setRefreshing] = react.useState(false);
			const load = react.useCallback(async (silent) => {
				if (!silent) setState((prev) => ({ ...prev, status: "loading" }));
				try {
					const response = await fetch("/account/usage", { cache: "no-store" });
					let body = {};
					try {
						body = await response.json();
					} catch {}
					if (!response.ok || body.ok !== true) {
						throw new Error(body.message !== void 0 && body.message !== "" ? body.message : `HTTP ${response.status}`);
					}
					setState({ status: "ready", data: body });
				} catch (error) {
					setState({ status: "error", error: error instanceof Error ? error.message : String(error) });
				}
			}, []);
			react.useEffect(() => {
				void load(false);
				const timer = setInterval(() => {
					void load(true);
				}, 5 * 60 * 1000);
				return () => clearInterval(timer);
			}, [load]);
			const jsx = react_jsx_runtime.jsx;
			const jsxs = react_jsx_runtime.jsxs;
			const ready = state.status === "ready";
			const primary = ready ? state.data.balance.infos[0] : void 0;
			const stateClass = ready ? styles.stateOk : state.status === "error" ? styles.stateErr : styles.state;
			const label = ready
				? primary !== void 0
					? formatMoney(primary.total, primary.currency)
					: t("noBalance")
				: state.status === "error"
					? t("errorShort")
					: t("loading");
			return jsxs("div", {
				className: styles.root,
				role: "button",
				tabIndex: 0,
				title: t("title"),
				"aria-label": t("title"),
				"aria-expanded": open,
				onClick: () => setOpen((v) => !v),
				onKeyDown: (event) => {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						setOpen((v) => !v);
					}
				},
				children: [
					jsx("span", { className: styles.state + " " + stateClass, "data-status": state.status }),
					jsx(WalletIcon, { className: styles.icon }),
					wide ? jsx("span", { className: styles.label, children: label }) : null,
					open ? jsxs("div", {
						className: styles.panel,
						onClick: (event) => {
							event.stopPropagation();
						},
						children: [
							jsxs("div", {
								className: styles.panelHead,
								children: [
									jsx("h4", { className: styles.panelTitle, children: t("title") }),
									ready ? jsx("span", {
										className: `${styles.statusBadge} ${state.data.balance.isAvailable ? styles.statusOk : styles.statusErr}`,
										children: state.data.balance.isAvailable ? t("available") : t("unavailable")
									}) : null
								]
							}),
							ready ? jsx("dl", {
								children: state.data.balance.infos.map((info) => jsxs(react.Fragment, {
									children: [
										jsxs("div", {
											className: styles.row,
											children: [
												jsx("dt", { children: t("currency") }),
												jsx("dd", { className: styles.cur, children: info.currency })
											]
										}),
										jsxs("div", {
											className: styles.row,
											children: [
												jsx("dt", { children: t("total") }),
												jsx("dd", { children: formatMoney(info.total, info.currency) })
											]
										}),
										jsxs("div", {
											className: styles.row,
											children: [
												jsx("dt", { children: t("granted") }),
												jsx("dd", { children: formatMoney(info.granted, info.currency) })
											]
										}),
										jsxs("div", {
											className: styles.row,
											children: [
												jsx("dt", { children: t("toppedUp") }),
												jsx("dd", { children: formatMoney(info.toppedUp, info.currency) })
											]
										})
									]
								}, info.currency))
							}) : null,
							state.status === "error" ? jsx("p", { className: styles.err, children: state.error ?? t("error") }) : null,
							jsxs("div", {
								className: styles.foot,
								children: [
									jsx("span", { children: ready ? `${t("updated")} ${formatTime(state.data.fetchedAt)}` : " " }),
									jsx("button", {
										className: styles.refresh,
										type: "button",
										disabled: refreshing,
										onClick: () => {
											setRefreshing(true);
											void load(true).finally(() => setRefreshing(false));
										},
										children: refreshing ? t("refreshing") : t("refresh")
									})
								]
							})
						]
					}) : null
				]
			});
		}
		//#endregion
		//#region locales
		const NS = "settings.accountUsage";
		const zh = {
			title: "账户余额",
			loading: "读取中…",
			noBalance: "无余额",
			errorShort: "余额获取失败",
			error: "暂时无法获取余额。",
			available: "可用",
			unavailable: "不可用",
			currency: "币种",
			total: "总余额",
			granted: "赠送",
			toppedUp: "充值",
			updated: "更新于",
			refresh: "刷新",
			refreshing: "刷新中…"
		};
		const en = {
			title: "Account balance",
			loading: "Loading…",
			noBalance: "No balance",
			errorShort: "Balance unavailable",
			error: "Balance is temporarily unavailable.",
			available: "Available",
			unavailable: "Unavailable",
			currency: "Currency",
			total: "Total",
			granted: "Granted",
			toppedUp: "Topped up",
			updated: "Updated",
			refresh: "Refresh",
			refreshing: "Refreshing…"
		};
		//#endregion
		//#region apply
		const inject = ["slots", "locale"];
		/** 注册侧边栏底部余额徽标（sidebar.footer.action 槽）。 */
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-account-usage: dictionaries");
			const t = ctx.locale.bind(NS);
			ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
				name: "sidebar.footer.action",
				id: "usage",
				order: 10,
				locale: NS
			}, UsageBadge));
		}
		//#endregion
		exports.NS = NS;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
