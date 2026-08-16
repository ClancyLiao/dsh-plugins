window.__ModuleLoader__.load({
	id: "dsh-client-ui-composer-optimize",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		//#region styles
		// order 重排：co_root（order 2）排在输入框 trailing 区的模型/上下文环之后，
		// 发送键（trailing 直接子 [class$=_primary]，order 3）再靠右 —— 魔法棒紧贴发送键左侧。
		const css = ".co_root{color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;border-radius:8px;width:26px;height:26px;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex;order:2}.co_root:hover:not(:disabled){color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}.co_root:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:-2px}.co_root:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}.co_spin{animation:.9s linear infinite co_spin-rotate}@keyframes co_spin-rotate{to{transform:rotate(360deg)}}.co_root[data-busy=true]{color:var(--dsw-alias-state-business-primary)}[class$=_trailing]>[class$=_primary]{order:3}";
		const tagId = "dsh-client-ui-composer-optimize/styles";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-client-ui-composer-optimize";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		const styles = {
			root: "co_root",
			spin: "co_spin"
		};
		//#endregion
		//#region component
		/** 魔法棒图标（内联 SVG，随当前颜色）。 */
		function WandIcon(props) {
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
						react_jsx_runtime.jsx("path", { d: "M15 4V2" }),
						react_jsx_runtime.jsx("path", { d: "M15 16v-2" }),
						react_jsx_runtime.jsx("path", { d: "M8 9h2" }),
						react_jsx_runtime.jsx("path", { d: "M20 9h2" }),
						react_jsx_runtime.jsx("path", { d: "M17.8 11.8 19 13" }),
						react_jsx_runtime.jsx("path", { d: "M15 9h.01" }),
						react_jsx_runtime.jsx("path", { d: "M17.8 6.2 19 5" }),
						react_jsx_runtime.jsx("path", { d: "m3 21 9-9" }),
						react_jsx_runtime.jsx("path", { d: "M12.2 6.2 11 5" })
					]
				})
			});
		}
		/**
		* OptimizeButton：输入框右下角的润色按钮。
		* @param props - `readDraft`/`setDraft`/`notify`（会话输入 facade）与 `t`。
		*/
		function OptimizeButton(props) {
			const { readDraft, setDraft, notify, t } = props;
			const [busy, setBusy] = react.useState(false);
			const jsx = react_jsx_runtime.jsx;
			const run = async () => {
				if (busy) return;
				let draft;
				try {
					draft = readDraft();
				} catch {
					draft = "";
				}
				if (draft.trim() === "") {
					notify("warn", t("empty"));
					return;
				}
				setBusy(true);
				try {
					const response = await fetch("/composer/optimize", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({ text: draft })
					});
					let body = {};
					try {
						body = await response.json();
					} catch {}
					if (!response.ok || body.ok !== true) {
						throw new Error(body.message !== void 0 && body.message !== "" ? body.message : `HTTP ${response.status}`);
					}
					setDraft(body.text);
					notify("ok", t("done"));
				} catch (error) {
					notify("error", error instanceof Error ? error.message : String(error));
				} finally {
					setBusy(false);
				}
			};
			return jsx("button", {
				className: styles.root,
				type: "button",
				title: t("title"),
				"aria-label": t("title"),
				"data-busy": busy ? "true" : void 0,
				disabled: busy,
				onClick: () => void run(),
				children: jsx(WandIcon, { className: busy ? styles.spin : void 0 })
			});
		}
		//#endregion
		//#region locales
		const NS = "settings.composerOptimize";
		const zh = {
			title: "优化提示词",
			empty: "输入框是空的，没有可优化的内容。",
			done: "已优化并回填输入框。"
		};
		const en = {
			title: "Optimize prompt",
			empty: "The input is empty; nothing to optimize.",
			done: "Optimized and written back to the input."
		};
		//#endregion
		//#region apply
		const inject = [
			"slots",
			"locale",
			"conversation",
			"sessions"
		];
		/** 注册输入框右下角的润色按钮（conversation.input.right 槽）。 */
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-composer-optimize: dictionaries");
			const t = ctx.locale.bind(NS);
			ctx.slots.inject("conversation.input.right", () => ctx.slots.register({
				name: "conversation.input.right",
				id: "optimize",
				order: 10,
				locale: NS,
				inject: (sessionId) => {
					const actx = ctx.sessions.scope(sessionId);
					if (actx === void 0) throw new Error(`composer-optimize: session "${String(sessionId)}" resolved no scope`);
					const conversation = actx.get("conversation");
					if (conversation === void 0) throw new Error("composer-optimize: conversation service unavailable");
					const shell = conversation.input.for(actx);
					return {
						readDraft: () => shell.snapshot.draft,
						setDraft: (text) => {
							shell.setDraft(text);
						},
						notify: (level, text) => {
							shell.notify(level, text);
						}
					};
				}
			}, OptimizeButton));
		}
		//#endregion
		exports.NS = NS;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
