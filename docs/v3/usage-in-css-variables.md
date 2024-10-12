
# Usage in CSS Variables

You can use css variables like `var(--un-preset-radix-red9)`, `var(--un-preset-radix-red9 , red)` in your project and it adds the corresponding colors. 

For example: 

```html
<div class='p-4'
  style="border-color: var(--un-preset-radix-blue5A); color: var(--un-preset-radix-gray12, 'darkgray')"
  >
  Text on gray background
</div>
```

Which will render as:

<div class='p-4'
  style="background: var(--un-preset-radix-blue5A); color: var(--un-preset-radix-sky11, 'skyblue')"
  >
  Text on gray background
</div>

If you use this in CSS files, make sure UnoCSS watches these CSS files.

If you change `prefix` option, you will need to change the CSS variables as well. For example, if you set prefix to `my-prefix`, you will need to change the CSS variables to `var(--my-prefix-red9)`, `var(--my-prefix-red9 , red)`.

DO NOT put an space between `var(` and `--un-preset-radix-...`. This won't be detected. 

- `var( --un-preset-radix-red9)` ❌ Will not work
- `var(--un-preset-radix-red9)` ✅ Works

- `var( --un-preset-radix-red9 )` ❌ Will not work
- `var(--un-preset-radix-red9 )` ✅ Works

- `var(--un-preset-radix-red9,red)` ❌ Will not work
- `var(--un-preset-radix-red9, red)` ✅ Works

- `linear-gradient(45deg,var(--un-preset-radix-red9),var(--un-preset-radix-orange9))` ❌ Will not work
- `linear-gradient(45deg, var(--un-preset-radix-red9) , var(--un-preset-radix-orange9) )`  ✅ Works
