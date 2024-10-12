# Alias Utility

With any scale included in your palette, you can use the utility `alias-{aliasName}-{scale}` like `alias-danger-red`. This sets a series of CSS variables that allow usage of `danger` in place of a color. For example:

```html
<div class="alias-danger-red bg-danger4"></div>
<div class="bg-red4"></div>
```

are equivalent.

Alias name can not be a radix hue, white, or black.

You can reset an alias name multiple times. For example:

```html
<div>
  <div class="alias-danger-red bg-danger4">
    <div class="bg-danger4">this has a red background</div>
    <div class="alias-danger-pink">
      <div class="bg-danger4">This has a pink background</div>
    </div>
  </div>
  <div class="alias-danger-violet">
    <div class="bg-danger4">This has a violet background</div>
  </div>
</div>
```

Also, using this utility, you can reset an alias set in config to a different hue.

If you need to safelist specific steps or all steps of an alias, use safelistAliases option in config.
