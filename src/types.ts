import { RADIX_HUES } from './consts';

export type Alpha = "A" | "";
export type RadixHue = (typeof RADIX_HUES)[number];
export type RadixHueOrBlackOrWhite = RadixHue | "white" | "black";
export type Shade = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";
export type ShadeAlpha =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "1A"
  | "2A"
  | "3A"
  | "4A"
  | "5A"
  | "6A"
  | "7A"
  | "8A"
  | "9A"
  | "10A"
  | "11A"
  | "12A";
export type P3 = "P3" | "";
export type Dark = "Dark" | "";
export type Token = string;
export type Property = string;
export type Alias = string;
export type Aliases = Record<Alias, RadixHue>;

export type SafeListColor = RadixHue | `${RadixHue}${Shade}${Alpha}` | "black" | "white" | `black${Shade}A` | `white${Shade}A`;
export interface Options {
  /**
   * The prefix of the generated css variables
   * @default --un-preset-radix
   */
  prefix: string;
  /**
   * Customize the selector used to apply the dark versions of the color palette
   * @default ".dark-theme"
   */
  darkSelector: string;
  /**
   * Customize the selector used to apply the light versions of the color palette
   * @default ":root, .light-theme"
   */
  lightSelector: string;
  /** Add color aliases */
  aliases: Aliases;
  /**
   * Colors to preserve. You can specific color shade (like blue4 or blue5A) or add a color (like blue) to preserve all 12 shades
   */
  safeListColors: readonly SafeListColor[];
  /**
   * Alias to preserve. Each alias will preserve all of its 12 shades.
   */
  safeListAliases: string[];
  /**
   * Extend instead of override the default theme
   * @default false
   */
  extend: boolean;
  /**
   * use P3 colors with sRGB  fallbacks
   * @default false
   */
  useP3Colors: boolean;
  /**
   * If your project has only one theme, set it here so CSS variables for other theme is not added to CSS.
   */
  onlyOneTheme?: "dark" | "light";
}

export type HueOrAlias = RadixHue | "black" | "white" | keyof Options["aliases"];

export type ColorProperties = {
  shade: Shade;
  alpha: Alpha;
  hue: RadixHueOrBlackOrWhite;
};

export type AliasProperties = {
  shade: Shade;
  alpha: Alpha;
};

export type ColorInUse = {
  shadesInUse: Record<ShadeAlpha, ColorProperties>;
};
export type AliasInUse = {
  shadesInUse: Record<ShadeAlpha, AliasProperties>;
  possibleHues: RadixHue[];
};

export  type ColorsInUse = Record<RadixHueOrBlackOrWhite, ColorInUse>;
export type AliasesInUse = Record<string, AliasInUse>;
