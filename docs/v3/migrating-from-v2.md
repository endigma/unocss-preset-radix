# Migrating from v2

## Breaking changes

- V3 uses Radix Colors V3 under the hood. Radix Colors are changed slightly in V3. Please note in V3, step 6, 7 and 8 are used for borders. (Steps 5,6 and 7 were used for borders in Radix Colors V2). Please visit [Radix Docs](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) for more information.

- `palette` option is removed. You don't need to specify palette colors anymore. Colors are added automatically and only the minimum required CSS variables are added to keep the CSS optimized. But if you need to safelist colors or aliases, use `safelist` option instead. Learn more about safelist option in [Configuration docs](/v3/configuration#safelist) section.

- `hue` utility is removed in favor of more flexible Alias Utility. You can replace `hue-red` and `bg-hue4` with `alias-hue-red` and use `bg-hue4`. You can use any other aliases instead of `hue`.

Alias name must be one of aliases defined in [`aliases` option](/v2/configuration#aliases), otherwise it won't work.

With Alias Utility you can use (and reset) multiple aliases in one scope (while with hue you are stick to one alias). For example:

```html
<ul>
  <li class="alias-base-slate alias-accent-violet bg-base3">
    <h3 class="text-accent11">My Card 1</h3>
    <div class="text-base11">lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
  </li>
  <li class="alias-base-sand alias-accent-orange bg-base3">
    <h3 class="text-accent11">My Card 2</h3>
    <div class="text-base11">lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
  </li>
</ul>
```

This feature is very useful for creating reusable components. You can use aliases to define what color steps (`bg-base3`, `text-base11`, `b-accent6`) each element has and pass `alias-base-slate` or `alias-accent-pink` as props to your component. This way, the color hue is no longer hardcoded in your component definition, but decoupled from it.

## New features

- You can use P3 colors with sRGB fallbacks. Set useP3Colors option to true to enable it.

- You can set the unocss layer you want to add generated css variables to, via layer option.

- You can use css variables (like `var(--un-preset-radix-red9)`, `var( --un-preset-radix-red9, red)`) in your project and the preset detects it and add corresponding colors. See [Usage in CSS variables](/v3/usage#usage-in-css-variables) for more information.

- You can opt to add only light colors (or only dark colors) to the CSS, bya onlyOneTheme option to `light` (or `dark`).

- If you need to safelist colors or aliases you can do it via `safelist` option in aliases. See [safelist option](/v3/configuration#safelist) for more information.
