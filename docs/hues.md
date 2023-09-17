# Hue Utility

With any scale included in your palette, you can use the utility `hue-{scale}` like `hue-red` or `hue-sand`. This sets a series of CSS variables that allow usage of `hue` in place of a color. For example:

```html
<div class="hue-red bg-hue4"></div>
<div class="bg-red4"></div>
```

are equivilant.

This allows you to add all the `hues` you'd like to use to your safelist, and be able to dynamically choose the colorway of an element using JS or whatever your poison of choice is.

This feature is heavily inspired by [Imba's `hue`](https://imba.io/docs/css/properties/hue)
