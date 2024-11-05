---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "unocss-preset-radix"
  text: "A preset for UnoCSS to let you use Radix color palette "
  actions:
    - theme: brand
      text: Installation & Usage
      link: /v3/usage
    - theme: alt
      text: Colors Showcase
      link: /v3/colors

features:
  - title: Alphas
    details: Fully supports alpha scales. You can use them like <code>bg-blue5A</code>.
  - title: P3 colors
    details: Use P3 colors with sRGB fallbacks.

  - title: Foregrounds
    details: The optimized foreground colors are available as `-fg` steps. For example text-blue-fg for white text-amber-fg for white. These colors are based on the Radix docs. This also works with hues and aliases.
  - title: Alias Utility
    details: Define aliases in your code. Like `alias-danger-red` and then use it like `bg-danger4` or `bg-danger5A`.
  - title: detect usage as CSS variables
    details: Use css variables (like `var(--un-preset-radix-red9)`, `var(--un-preset-radix-red9 , red)`) and it adds the corresponding colors to your project.
---
