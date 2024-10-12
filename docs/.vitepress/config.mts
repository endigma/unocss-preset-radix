import { defineConfig } from 'vitepress';
import { presetUno } from 'unocss';
import { presetRadix } from '../../src';
import unocss from 'unocss/vite';
import { RADIX_HUES } from '../../src/consts';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'unocss-preset-radix',
  base: '/unocss-preset-radix/',
  vite: {
    plugins: [
      unocss({
        presets: [
          presetUno(),
          presetRadix({
            darkSelector: '.dark',
            lightSelector: ':root, .light',
            aliases: {
              danger: 'red',
              warning: 'amber',
              accent: 'blue',
            },
            safelist: [...RADIX_HUES, 'danger', 'warning3', 'warning5A', 'warning-fg'],
          }),
        ],
        safelist: [
          ...['', 'A']
            .map((alpha) =>
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((step) => RADIX_HUES.map((hue) => `bg-${hue}${step}${alpha}`))
            )
            .flat()
            .flat(),
          ...RADIX_HUES.map((h) => [`text-${h}9`, `text-${h}-fg`,  `text-${h}12`,  `text-${h}1`]).flat(),
        ],
      }),
    ],
  },
  description: 'A unocss preset for radix colors',
  themeConfig: {
    nav: [{ text: 'Home', link: '/' }],
    sidebar: [
      {
        text: 'Guides',
        items: [
          { text: 'Installation & Usage', link: '/v3/usage' },
          { text: 'Configuration', link: '/v3/configuration' },
          { text: 'Alias Utility', link: '/v3/alias-utility' },
          { text: 'Usage in CSS Variables', link: '/v3/usage-in-css-variables' },
          { text: 'Migrating from v2', link: '/v3/migrating-from-v2' },
        ],
      },
      {
        text: 'Other',
        items: [{ text: 'Colors', link: '/v3/colors' }],
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/endigma/unocss-preset-radix',
      },
    ],
  },
});
