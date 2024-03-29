---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "unocss-preset-radix"
  text: "A preset for UnoCSS to let you use Radix color palette "
  actions:
    - theme: brand
      text: Installation & Usage
      link: /usage
    - theme: alt
      text: Colors Showcase
      link: /colors

features:
  - title: Alphas
    details: Fully supports alpha scales. You can use them like <code>bg-blue5A</code>.
  - title: Foregrounds
    details: The optimized foreground colors are available as -fg shades. For example text-blue-fg for white text-amber-fg for white. These colors are based on the Radix docs. This also works with hues and aliases.
  - title: Hues
    details: Inspired by Imba's `hue` utility, you can dynamically set the hue of an element and its children.
---
