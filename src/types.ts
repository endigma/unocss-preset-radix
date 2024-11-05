import { RADIX_HUES } from "./consts";
export type Alpha = "A" | "";
export type RadixHue = (typeof RADIX_HUES)[number];
export type Step = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "-fg";
export type StepAlpha =
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
  | "12A"
  | "-fg";
export type P3 = "P3" | "";
export type Dark = "Dark" | "";
export type Token = string;
export type Property = string;
export type Alias = string;
export type Aliases = Record<Alias, RadixHue>;

export type SafelistColor =
  | RadixHue
  | `${RadixHue}${StepAlpha}`
  | "black"
  | "white"
  | `black${Step}A`
  | `white${Step}A`
  | `white-fg`
  | `black-fg`;

type KeyOf<T> = Extract<keyof T, string>; // string key of records.
type SafeListAlias<T extends Aliases> = KeyOf<T> | `${KeyOf<T>}${Step}${Alpha}` | `${KeyOf<T>}-fg`;

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
   * List of Colors or Aliases you want to preserve. You can specific color step (like `blue4` or `blue5A`) or add a color (like blue) to preserve all 12 steps, 12 alpha steps and `fg` step.
   * Same for aliases. You can preserve specific step of an alias like `success4`, `success5A`, `success-fg` or add `success` to preserve all 12 steps, all 12 alpha steps and fg preserved). Note any safelist alias must be defined in aliases option, otherwise it will be ignored.
   */
  safelist?: Readonly<SafelistColor | SafeListAlias<T>>[];

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
   * @default undefined
   */
  onlyOneTheme?: "dark" | "light";
  /**
   * name of unocss layer to add generated css variables to
   * @default undefined
   */
  layer?: string;
}

export type HueOrAlias = RadixHue | "black" | "white" | string;
