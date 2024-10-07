import { RADIX_HUES } from './consts';

export type Alpha = 'A' | '';
export type RadixHue = (typeof RADIX_HUES)[number];
export type Shade = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '-fg';
export type ShadeAlpha =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '1A'
  | '2A'
  | '3A'
  | '4A'
  | '5A'
  | '6A'
  | '7A'
  | '8A'
  | '9A'
  | '10A'
  | '11A'
  | '12A'
  | '-fg';
export type P3 = 'P3' | '';
export type Dark = 'Dark' | '';
export type Token = string;
export type Property = string;
export type Alias = string;
export type Aliases = Record<Alias, RadixHue>;

export type SafelistColor =
  | RadixHue
  | `${RadixHue}${ShadeAlpha}`
  | 'black'
  | 'white'
  | `black${Shade}A`
  | `white${Shade}A`
  | `white-fg`
  | `black-fg`;

type SafeListAlias<T extends string> = T | `${T}${Shade}${Alpha}` | `${T}-fg`;

export interface Options<T extends Aliases> {
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
  /**
   * Customize the selector used to apply the light versions of the color palette
   * @default ":root, .light-theme"
   */
  lightSelector?: string;
  /** Add color aliases */
  aliases?: T;
  /**
   * Colors to preserve. You can specific color shade (like blue4 or blue5A) or add a color (like blue) to preserve all 12 shades
   */
  safelistColors?: readonly SafelistColor[];
  /**
   * Alias to preserve. Each alias will preserve all of its 12 shades.
   */
  safelistAliases?: readonly SafeListAlias<Extract<keyof T, string>>[];
  /**
   * Extend instead of override the default theme
   * @default false
   */
  extend?: boolean;
  /**
   * use P3 colors with sRGB  fallbacks
   * @default false
   */
  useP3Colors?: boolean;
  /**
   * If your project has only one theme, set it here so CSS variables for other theme is not added to CSS.
   */
  onlyOneTheme?: 'dark' | 'light';
  /**
   * name of unocss layer to add generated css variables to
   * @default "radix-colors"
   */
  layer?: string;
}

export type HueOrAlias = RadixHue | 'black' | 'white' | string;
