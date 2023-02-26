import { genCSS, generateColors, generateHues, newPalette, type RadixColors } from "./radix";
import type { Preset } from "@unocss/core";

export type ColorAlias = [alias: string, target: string];

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
  darkSelector?: string;

  /** Add color aliases */
  aliases?: ColorAlias[];
}

export function generateAliases(colors: ReturnType<typeof generateColors>, aliases: ColorAlias[]) {
  return aliases.reduce((o, [alias, target]) => {
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
    palette: selectedColors,
    aliases: selectedAliases = [],
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
        ([, color], e) => {
          if (selectedColors.includes(color as RadixColors)) {
            return minify(`
            .hue-${color} {
              ${prefix}hue1: var(${prefix}${color}1);
              ${prefix}hue2: var(${prefix}${color}2);
              ${prefix}hue3: var(${prefix}${color}3);
              ${prefix}hue4: var(${prefix}${color}4);
              ${prefix}hue5: var(${prefix}${color}5);
              ${prefix}hue6: var(${prefix}${color}6);
              ${prefix}hue7: var(${prefix}${color}7);
              ${prefix}hue8: var(${prefix}${color}8);
              ${prefix}hue9: var(${prefix}${color}9);
              ${prefix}hue10: var(${prefix}${color}10);
              ${prefix}hue11: var(${prefix}${color}11);
              ${prefix}hue12: var(${prefix}${color}12);
            }
          `);
          }
        },
      ],
    ],
    extendTheme(theme: { [key: string]: any }) {
      theme.colors = {
        ...colors,
        ...hues,
        ...aliases,
      };
    },
    preflights: [
      {
        layer: "radix",
        getCSS: () => genCSS(palette, darkSelector, prefix),
      },
    ],
  };

  return preset;
};
