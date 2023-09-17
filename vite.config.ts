import { defineConfig } from "vite";
import { presetUno } from "unocss";
import { presetRadix, radixColors } from "./src";
import unocss from "unocss/vite";
import dts from "vite-plugin-dts";

export default defineConfig(({}) => ({
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
  ],
}));
