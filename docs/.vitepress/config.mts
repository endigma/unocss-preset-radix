import { defineConfig } from "vitepress";
import { presetUno } from "unocss";
import { presetRadix, radixColors } from "../../src";
import unocss from "unocss/vite";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "unocss-preset-radix",
  base: "/unocss-preset-radix/",
  vite: {
    plugins: [
      unocss({
        presets: [
          presetUno(),
          presetRadix({
            palette: radixColors,
            darkSelector: ".dark",

            aliases: {
              testa: "red",
              testb: "amber",
            },
          }),
        ],
        safelist: [
          ...radixColors.map((p) => `hue-${p}`),
          ...Array.from({ length: 12 }, (_, i) => `bg-hue${i + 1}`),
          ...Array.from({ length: 12 }, (_, i) => `bg-hue${i + 1}A`),
        ],
      }),
    ],
  },
  description: "A unocss preset for radix colors",
  themeConfig: {
    nav: [{ text: "Home", link: "/" }],

    sidebar: [
      {
        text: "Guides",
        items: [
          { text: "Installation & Usage", link: "/usage" },
          { text: "Configuration", link: "/configuration" },
          { text: "Hue Utility", link: "/hues" },
        ],
      },
      {
        text: "Other",
        items: [{ text: "Colors", link: "/colors" }],
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/endigma/unocss-preset-radix",
      },
    ],
  },
});
