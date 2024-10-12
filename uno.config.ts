import { defineConfig, presetUno, transformerVariantGroup } from 'unocss';
import { presetRadix } from './src';
// import * as radixColors from '@radix-ui/colors';
// import presetPrimitives from "unocss-preset-primitives";
export default defineConfig({
  theme: {
    colors: {
      subdued: 'var(--rx-slate11)',
    },
    breakpoints: {
      xxs: '420px',
      xs: '480px',
      sm: '640px',
      md: '768px',
    },
  },
  transformers: [transformerVariantGroup()],
  presets: [
    presetUno({
      dark: 'class',
    }),
    presetRadix({
      prefix: '-rx-',
      darkSelector: '.my-dark-selector',
      lightSelector: '.light-selector',
      aliases: {
        success: 'green',
        warning: 'amber',
        danger: 'tomato',
        // info: 'green'
      },
      useP3Colors: true,
      // safelistAliases: ['danger'],
      extend: true,
      // useP3Colors: true,
      // onlyOneTheme: 'dark',
      // safelistAliases: ['warning', 'danger4A'],
      safelist: ['pink3A', 'white11A', 'blue' , 'warning', 'danger4A'],
    }),
  ],
});
