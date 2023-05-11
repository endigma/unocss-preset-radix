import { defineConfig } from "vite";
import { presetUno } from "unocss";
import { presetRadix, radixColors } from "./src";
import unocss from "unocss/vite";
import dts from "vite-plugin-dts";

export default defineConfig(({ mode }) => ({
  build: {
    lib:
      mode === "demo"
        ? false
        : {
            entry: "./src/index.ts",
            name: "unocss-preset-radix",
            fileName: "index",
            formats: ["es", "cjs"],
          },
    rollupOptions: {
      external: ["unocss"],
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
    unocss({
      presets: [
        presetUno(),
        presetRadix({
          palette: radixColors,
        }),
      ],
      safelist: [
        ...radixColors.map((p) => `hue-${p}`),
        ...Array.from({ length: 12 }, (_, i) => `bg-hue${i + 1}`),
        ...Array.from({ length: 12 }, (_, i) => `bg-hue${i + 1}A`),
      ],
    }),
  ],
}));
