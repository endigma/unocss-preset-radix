# Migrating from v2

## Breaking changes

- You need to use Radix Colors V3.

- `palette` option is removed. You don't need to specify palette colors anymore. Colors are added autoamtically. But if you need to safelist colors, use `safelistColors` option instead. 

- `hue` utility is removed in favor of more flexible Alias Utility. You can replace `hue-red` and `bg-hue4` with `alias-danger-red` and `bg-danger4`.

## Other new features

You can use P3 colors with sRGB fallbacks. Set useP3Colors option to true to enable it.

You can set the unocss layer you want to add generated css variables to, via layer option.

You can opt to add only light colors (or only dark colors) to the CSS, bya onlyOneTheme option to `light` (or `dark`).

You can use `fg` on colors as well as aliases, like `bg-blue-fg` or `alias-blue-fg`.

In safelistColors option, you can safelist all shades of a color `blue` or specific shades like `blue4`, `blue5A`, `blue-fg`.

In safelistAliases option, you can safelist all shades of an alias `danger` or specific shades like `danger4`, `danger5A`, `danger-fg`. Make sure you have defined the alias in aliases option.
