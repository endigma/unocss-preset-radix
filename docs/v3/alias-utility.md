# Alias Utility

With any scale included in your palette, you can reset aliases to a new hue by using the utility `alias-{aliasName}-{hue}` like `alias-accent-violet`. This sets a series of CSS variables that allow usage of `danger` in place of a color. For example:

```html
<button class="px-4 py-2 rd-2 alias-accent-violet bg-accent4">Button</button>
```

Which renders as:

<button class="px-4 py-2 rd-2 alias-accent-violet bg-accent4 bg-my-color">Button</button>

::: warning
Note alias name must be one of aliases defined in [`aliases` option](/v2/configuration#aliases), otherwise it won't work.
:::

You can reset an alias name multiple times. For example:

```html
<div>
  <div class="alias-accent-red bg-accent4">
    <div class="bg-accent4">This has a red background</div>
    <div class="alias-accent-pink">
      <div class="bg-accent4">This has a pink background</div>
    </div>
  </div>
  <div class="alias-accent-violet">
    <div class="bg-accent4">This has a violet background</div>
  </div>
</div>
```

Also, using this utility, you can reset an alias set in [`aliases` option in configuration](/v3/configuration#aliases) to a different hue.

If you need to safelist specific steps or all steps of an alias, use safelistAliases option in config.
