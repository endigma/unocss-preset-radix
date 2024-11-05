# Usage in CSS Variables

You can use css variables like `var(--un-preset-radix-red9)`, `var( --un-preset-radix-red9, red)` in your project and it adds the corresponding colors.

For example:

```html
<div class="p-4" style="border-color: var(--un-preset-radix-blue5A); color: var(--un-preset-radix-gray12, 'darkgray')">
  Text on gray background
</div>
```

Which will render as:

<div class='p-4'
  style="background: var(--un-preset-radix-blue5A); color: var(--un-preset-radix-sky11, 'skyblue')"
  >
  Text on gray background
</div>

::: info
The preset removes the space after `var(`, the trailing space, the trailing comma or the closing bracket. So all of these works:

- var(--un-preset-radix-red9)
- var(--un-preset-radix-red9 )
- var( --un-preset-radix-red9)
- var( --un-preset-radix-red9 )
- var(--un-preset-radix-red9,red)
- var(--un-preset-radix-red9 ,red)
- var( --un-preset-radix-red9, red)
- var( --un-preset-radix-red9,red)
- var(--un-preset-radix-red9,red)
- var(--un-preset-radix-red9,var(--...))

:::

If you use this in CSS files, make sure UnoCSS watches these CSS files.

If you change `prefix` option, you will need to change the CSS variables as well. For example, if you set prefix to `my-prefix`, you will need to change the CSS variables to `var(--my-prefix-red9)`, `var(--my-prefix-red9 , red)`.
