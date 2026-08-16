# dsh-plugins

A collection of plugins for [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) (topic: `dsh-plugin`).

| Package | What it does |
| --- | --- |
| [dsh-think-in-chinese](dsh-think-in-chinese) | Make the model's thinking/reasoning always output Simplified Chinese |
| [dsh-plugin-inventory-notes](dsh-plugin-inventory-notes) + [dsh-client-ui-plugin-notes](dsh-client-ui-plugin-notes) | Show a one-line summary on every plugin card in the plugin-list settings tab |
| [dsh-github-market](dsh-github-market) + [dsh-client-ui-github-market](dsh-client-ui-github-market) | Plugin marketplace tab: browse/search/install GitHub `dsh-plugin` topic plugins |
| [dsh-plugin-composer-optimize](dsh-plugin-composer-optimize) + [dsh-client-ui-composer-optimize](dsh-client-ui-composer-optimize) | Polish the composer input with the model (a wand icon next to the send button) |
| [dsh-plugin-account-usage](dsh-plugin-account-usage) + [dsh-client-ui-account-usage](dsh-client-ui-account-usage) | Show the DeepSeek account balance at the bottom of the sidebar |

## Install

Each package is a [dsh bundle](https://github.com/deepseek-ai/DeepSeek-Harness/blob/master/docs/user/develop/basic/publish.zh.md).
Since the packages are not published to npm yet, install from this checkout:

```sh
git clone https://github.com/ClancyLiao/dsh-plugins
cd dsh-plugins
dsh plugin --profile <profile> add ./dsh-think-in-chinese
```

Repeat the `dsh plugin add ./<package>` line for each package you want, for example:

```sh
dsh plugin --profile desktop add ./dsh-plugin-inventory-notes
dsh plugin --profile desktop add ./dsh-client-ui-plugin-notes
dsh plugin --profile desktop add ./dsh-github-market
dsh plugin --profile desktop add ./dsh-client-ui-github-market
dsh plugin --profile desktop add ./dsh-plugin-composer-optimize
dsh plugin --profile desktop add ./dsh-client-ui-composer-optimize
dsh plugin --profile desktop add ./dsh-plugin-account-usage
dsh plugin --profile desktop add ./dsh-client-ui-account-usage
```

Then restart DSH Desktop (or relaunch `dsh --profile <profile>`).

> Note: `dsh-plugin-inventory-notes` disables the built-in `ui-settings-plugin-inventory`
> row because `dsh-client-ui-plugin-notes` replaces the plugin-list tab.

## Development

All packages are plain ESM; no build step. `lib/index.js` is the host half
(and the plugin body), `lib/client.js` is the browser half for client plugins
(`dsh.client` declared in `package.json`).

## License

MIT
