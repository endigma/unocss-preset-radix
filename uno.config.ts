import { defineConfig, presetUno, transformerVariantGroup } from "unocss";
import { presetRadix } from "./src";
export default defineConfig({
  presets: [
    presetUno(),
    presetRadix({
      // prefix: '-rx-',
      darkSelector: ".my-dark-selector",
      lightSelector: ".light-selector",
      aliases: {
        success: "green",
        warning: "amber",
        danger: "tomato",
        // info: 'green'
      },
      useP3Colors: true,
      extend: true,
      // onlyOneTheme: 'dark',
      // safelist: ['pink3A', 'white11A', 'blue' , 'warning', 'danger4A'],
    }),
  ],
});
