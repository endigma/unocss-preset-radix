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

## Vite/UnoCSS Configuration

```ts
// uno.config.ts (or vite.config.ts)
import { defineConfig, presetUno } from 'unocss';
import { presetRadix } from 'unocss-preset-radix';

export default defineConfig({
  presets: [
    presetUno(),
    presetRadix({
      aliases: {
        primary: 'green',
        base: 'slate',
      },
    }),
  ],
});
```

## Usage in HTML

You will now have access to colors from your palette, like:

```html
<p class="text-red9">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
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

## Usage in CSS Variables

You can use css variables (like `var(--un-preset-radix-red9)`, `var(--un-preset-radix-red9 , red)`) in your project and the preset detects it and add corresponding colors.

```html
<div style="background-color: var(--un-preset-radix-gray1); color: var(--un-preset-radix-gray12, 'darkgray')">Text on gray background</div>
```
If you use this in CSS files, make sure UnoCSS the CSS files.

If you change prefix in the settings, you will need to change the CSS variables as well. For example, if you set prefix to `my-prefix`, you will need to change the CSS variables to `var(--my-prefix-red9)`, `var(--my-prefix-red9 , red)`.

DO NOT put an space between `var(` and `--un-preset-radix-`. This won't be detected. 

`var(--un-preset-radix-red9)` ✅ Works
`var(--un-preset-radix-red9, red)` ✅ Works
`var(--un-preset-radix-red9 )` ✅ Works

`var(--un-preset-radix-red9,red)` ❌ Will not work
`var( --un-preset-radix-red9)` ❌ Will not work
`var( --un-preset-radix-red9 )` ❌ Will not work

## Advanced Configuration

```ts
// uno.config.ts (or vite.config.ts)
import { defineConfig, presetUno } from 'unocss';
import { presetRadix } from 'unocss-preset-radix';

export default defineConfig({
  presets: [
    presetUno(),
    presetRadix({
      aliases: {
        primary: 'green',
        base: 'slate',
      },
      safelist: [
        'amber', /* this adds amber1, amber2, ..., amber12 and 
        amber1A, amber2A, ..., amber12A 
        whether they are used in your project or not. 
        This is useful when you add classes on runtime
        (ex from user input or over network). */
        'blue4', // only adds blue4 whether it is used in your project or not.
        'green3A', // only adds green4A.
        'white7A', // only adds white7A.
        'primary', // adds primary1, primary2, ..., primary12 and primary1A, primary2A, ..., primary12A whether they are used in your project or not.
      ],
      prefix: 'my-prefix', // CSS variables will be generated with this prefix
      darkSelector: '.dark-theme', // CSS variables for dark colors will be applied to this selector
      lightSelector: ':root .light-theme', // CSS variables for light colors will be applied to this selector
      useP3Colors: true, // use P3 colors with sRGB fallbacks
      extend: true, // extend instead of override the default theme
      onlyOneTheme: 'dark', /* if your project has only dark theme, 
      set it here so CSS variables for other theme is not added to CSS.
      If this option is present, darkSelector and lightSelector will be ignored 
      and all CSS variables will be added to the :root selector. */
    }),
  ],
});
```
