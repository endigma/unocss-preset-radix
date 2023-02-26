# unocss-preset-radix

## Installation

```
pnpm add -D unocss-preset-radix
```

## Usage

```ts
import { defineConfig, presetUno } from "unocss";
import { presetRadix } from "unocss-preset-radix";

export default defineConfig({
  presets: [
    presetUno(),
    presetRadix({
      palette: ["blue", "green", "red"],
      aliases: [
        ["primary", "green"],
        ["info", "blue"],
      ],
    }),
  ],
});
```

## Options

### palette

An array of the Radix UI Colors you'd like to include. Dark mode is automatic.

### prefix

The prefix used for the CSS variables generated by the preset. Default is `--un-preset-radix`.

### darkSelector

The selector used for dark mode palette. Default is `.dark-theme`.

### aliases

An array of tuples in the format `[alias, target]` that allows you to set aliases for the color palette. This does _not_ work with `hue` at the moment. (Feel free to contribute this, it's just a technicality with how `hue` works)

## `hue`

With any scale included in your palette, you can use the utility `hue-{scale}` like `hue-red` or `hue-sand`. This sets a series of CSS variables that allow usage of `hue` in place of a color. For example:

```html
<div class="hue-red bg-hue4" />
<div class="bg-red4" />
```

are equivilant.

This allows you to add all the `hues` you'd like to use to your safelist, and be able to dynamically choose the colorway of an element using JS or whatever your poison of choice is.

This feature is heavily inspired by [Imba's `hue`](https://imba.io/docs/css/properties/hue)
