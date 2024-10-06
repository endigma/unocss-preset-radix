import { defineConfig, presetUno, transformerVariantGroup } from "unocss";
import { presetRadix } from "./src";
// import * as radixColors from '@radix-ui/colors';
// import presetPrimitives from "unocss-preset-primitives";
export default defineConfig({
  theme: {
    colors: {
      subdued: "var(--rx-slate11)",
    },
    breakpoints: {
      xxs: "420px",
      xs: "480px",
      sm: "640px",
      md: "768px",
    },
  },
  transformers: [transformerVariantGroup()],
  presets: [
    presetUno({
      dark: "class",
    }),
    presetRadix({
      darkSelector: ".dark",
      aliases: {
        testa: "red",
        testb: "amber",
      },
      safelistAliases: ["testa"],
      safelistColors: ["amber"],
    }),
  ],
});
