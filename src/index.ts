import { genCSS, generateColors, generateHues, newPalette, type RadixColors } from "./radix";
import type { Preset } from "@unocss/core";

export { RadixColors };

export type ColorAliases = { [key: string]: RadixColors };

export interface PresetRadixOptions {
  palette: RadixColors[];
  /**
   * The prefix of the generated css variables
   * @default --un-preset-radix
   */
  prefix?: string;

  /**
   * Customize the selector used to apply the dark versions of the color palette
   * @default ".dark-theme"
   */
  darkSelector?: string | boolean;

  /**
   * Customize the selector used to apply the light versions of the color palette
   * @default ":root, .light-theme"
   */
  lightSelector?: string;

  /** Add color aliases */
  aliases?: ColorAliases;
}

export function generateAliases(colors: ReturnType<typeof generateColors>, aliases: ColorAliases) {
  return Object.entries(aliases).reduce((o, [alias, target]) => {
    o[alias] = colors[target];
    return o;
  }, {} as { [key: string]: { [key: number]: string } });
}

function minify(css: string) {
  return css.replace(/\n/g, "").replace(/\s+/g, "").trim();
}

export const presetRadix = <T extends {}>(options: PresetRadixOptions): Preset<T> => {
  const {
    prefix = "--un-preset-radix-",
    darkSelector = ".dark-theme",
    lightSelector = ":root, .light-theme",
    palette: selectedColors,
    aliases: selectedAliases = {},
  } = options;

  const palette = newPalette(...selectedColors);
  const colors = generateColors(palette, prefix);
  const hues = generateHues(prefix);
  const aliases = generateAliases(colors, selectedAliases);

  const preset: Preset<T> = {
    name: "unocss-preset-radix",
    layers: {
      radix: 0,
      default: 1,
    },
    rules: [
      [
        /^hue-(.+)$/,
        ([, color]) => {
          let target: string = "";
          if (selectedColors.includes(color as RadixColors)) {
            target = color;
          } else if (color in selectedAliases) {
            target = selectedAliases[color];
          }

          if (target) {
            return minify(`
            .hue-${color} {
              ${prefix}hue1: var(${prefix}${target}1);
              ${prefix}hue2: var(${prefix}${target}2);
              ${prefix}hue3: var(${prefix}${target}3);
              ${prefix}hue4: var(${prefix}${target}4);
              ${prefix}hue5: var(${prefix}${target}5);
              ${prefix}hue6: var(${prefix}${target}6);
              ${prefix}hue7: var(${prefix}${target}7);
              ${prefix}hue8: var(${prefix}${target}8);
              ${prefix}hue9: var(${prefix}${target}9);
              ${prefix}hue10: var(${prefix}${target}10);
              ${prefix}hue11: var(${prefix}${target}11);
              ${prefix}hue12: var(${prefix}${target}12);
            }
          `);
          }

          return "";
        },
      ],
    ],
    extendTheme(theme: { [key: string]: any }) {
      theme.colors = {
        ...colors,
        ...aliases,
        ...hues,

        white: "#ffffff",
        black: "#000000",
        transparent: "transparent",
        current: "currentColor",
        inherit: "inherit",
      };
    },
    preflights: [
      {
        layer: "radix",
        getCSS: () => genCSS(palette, darkSelector, lightSelector, prefix),
      },
    ],
  };

  return preset;
};
