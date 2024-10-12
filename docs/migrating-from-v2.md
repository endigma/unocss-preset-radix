# Migrating from v2

## Breaking changes

- V3 uses Radix Colors V3 under the hood. Radix Colors are changed slightly in V3. Please note in V3, step 6,7 and 8 are used for borders. (in Radix Colors v2 steps 5,6 and 7 are used for borders). Please visit [Radix Docs](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) for more information.

- `palette` option is removed. You don't need to specify palette colors anymore. Colors are added autoamtically. This version adds the minimum required CSS variables to keep the CSS optimised. But if you need to safelist colors, use `safelistColors` option instead. Also, if you need to safelist aliases, use `safelistAliases` option instead.

- `hue` utility is removed in favor of more flexible Alias Utility. You can replace `hue-red` and `bg-hue4` with `alias-hue-red` and use`bg-hue4`. You can use any other aliases instead of `hue`. With Alias Utility you can define multiple aliases in one scope (while with hue you are stick to one alias). For example:

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

This feature is very usefull for creating reusable components. You can use aliases to define what color steps (`bg-base3`, `text-base11`, `b-accent6`) each element has and pass `alias-base-slate` or `alias-accent-pink` as props to your component. This way, the color hue is no longer hardcoded in your component defenition, but decoupled from it.

## Other new features

You can use P3 colors with sRGB fallbacks. Set useP3Colors option to true to enable it.

You can set the unocss layer you want to add generated css variables to, via layer option.

You can opt to add only light colors (or only dark colors) to the CSS, bya onlyOneTheme option to `light` (or `dark`).

You can use `fg` on colors as well as aliases, like `bg-blue-fg` or `alias-blue-fg`.

In safelistColors option, you can safelist all shades of a color `blue` or specific shades like `blue4`, `blue5A`, `blue-fg`.

In safelistAliases option, you can safelist all shades of an alias `danger` or specific shades like `danger4`, `danger5A`, `danger-fg`. Make sure you have defined the alias in aliases option.
