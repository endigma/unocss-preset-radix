---
outline: deep
---

# Getting Started

## Installation

::: code-group

```sh [npm]
$ npm add -D unocss-preset-radix
```

```sh [pnpm]
$ pnpm add -D unocss-preset-radix
```

```sh [yarn]
$ yarn add -D unocss-preset-radix
```

:::

## Vite/UnoCSS configuration

```ts
// uno.config.ts (or vite.config.ts)
import { defineConfig, presetUno } from "unocss";
import { presetRadix } from "unocss-preset-radix";

export default defineConfig({
  presets: [
    presetUno(),
    presetRadix({
      palette: ["blue", "green", "red"],
      aliases: {
        primary: "green",
        base: "slate",
      },
    }),
  ],
});
```

## Usage in HTML

You will now have access to colors from your palette, like:

```html
<p class="text-red9">
	Lorem ipsum dolor sit amet consectetur adipisicing elit.
</p>
```

Which will render as:

<p class="text-red9">
	Lorem ipsum dolor sit amet consectetur adipisicing elit.
</p>

The colors automatically support dark mode, so you can use:

```html
<div class="p-4 bg-gray1 text-gray12">Text on gray background</div>
```

Which will render as:

<div class="p-4 bg-gray1 text-gray12">Text on gray background</div>

You can switch the docs theme in the ... menu in the top right corner of the page.
