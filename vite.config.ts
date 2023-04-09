import { defineConfig } from "vite";
import { presetUno } from "unocss";
import { presetRadix, radixColors } from "./src";
import unocss from "unocss/vite";
import dts from "vite-plugin-dts";

export default defineConfig(({ mode }) => ({
  build: {
    lib: {
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
        ...Array.from({ length: 100 }, (_, i) => i + 1).flatMap((i) =>
          radixColors.map((c) => `bg-${c}${i}`)
        ),
        ...Array.from({ length: 100 }, (_, i) => i + 1).flatMap((i) =>
          radixColors.map((c) => `text-${c}${i}`)
        ),
      ],
    }),
  ],
  //   build: {
  //     minify: mode === "demo",
  //     lib:
  //       mode === "demo"
  //         ? false
  //         : {
  //             entry: "./src/index.ts",
  //             formats: ["es", "cjs"],
  //             fileName: "index",
  //           },
  //     rollupOptions: {
  //       external: ["unocss"],
  //     },
  //   },
}));
