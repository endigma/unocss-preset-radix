import { Preset, RuleContext, VariantContext, CSSEntries } from "unocss";
import type { Theme } from "unocss/preset-uno";
import {
  type AliasesInUse,
  type Alpha,
  type ColorsInUse,
  type P3,
  type Shade,
  type Options,
  type RadixHue,
  type Token,
  type Alias,
  Property,
  HueOrAlias,
  ShadeAlpha,
} from "./types";
import { genPreflightCSS } from "./genPrefelightCSS";
import { extendTheme } from "./extendTheme";
import { RADIX_HUES } from './consts';

const ALPHAS: Alpha[] = ["", "A"];
const P3S: P3[] = ["", "P3"];
const SHADES: Shade[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

const colorsInUse = {} as ColorsInUse;
const aliasesInUse = {} as AliasesInUse;

export function myPreset2({
  useP3Colors = false,
  prefix: _prefix = "--un-preset-radix-",
  darkSelector = ".dark-theme",
  lightSelector = ":root, .light-theme",
  aliases = {},
  safeListColors = [],
  safeListAliases = [],
  extend = false,
  onlyOneTheme,
}: Options): Preset<Theme> {
  let prefix = _prefix.replaceAll("-", " ").trim().replaceAll(" ", "-"); // remove hyphens from start and end.

  addSafeListColorsToColorsInUse({ safeListColors }); // add all 12 shaded and 12 alpha shades
  addSafeListAliasesToAliasesInUse({ safeListAliases, aliases }); // add all 12 shaded and 12 alpha shades
  addOtherAliasesToAliasesInUse({ safeListAliases, aliases }); // this one only adds hues, shades are added as used in project
  return {
    name: "unocss-preset-radix",
    shortcuts: [
      // this shortcut exsit so generated css for colors to have same order.
      [/^(.*)-(transparent|white|black|current|current-color|inherit)$/, ([token]) => `${token}`],
      [
        /^([a-z]|[a-z][a-z]|[a-z-]+[a-z-]+[a-z])-([A-Za-z]+)(1|2|3|4|5|6|7|8|9|10|11|12)(A)?$/,
        (
          match,
          context: RuleContext
        ) => {
          if (!match) return;
          const [token, property, hueOrAlias, shade, alpha = ""] = match as [Token, Property, HueOrAlias, Shade, Alpha];
          // do nothing for anything other than radix huse, black and white and aliases 
          if (!['black', 'white', ...RADIX_HUES, ...Object.keys(aliasesInUse)].includes(hueOrAlias)) return token;

          // filters out white and black without alpha, early and no need to worry about them later on.
          if (["black", "white"].includes(hueOrAlias) && alpha === "") {
            return `${token}`;
          }

          if (["black", "white", ...RADIX_HUES].includes(hueOrAlias)) {
            addColorToColorsInUse({
              hue: hueOrAlias as RadixHue | 'white' | 'black',
              shade,
              alpha
            });
          }
          if (Object.keys(aliasesInUse).includes(hueOrAlias)) {
            const alias = hueOrAlias;
            addAliasToAliasesInUse({ alias, shade, alpha }); // note we don't know hues. But we use possible Hues to generate all of it.

            // add all possible hue-shades to colorsInUse.
            for (const possibleHue of aliasesInUse[alias].possibleHues) {
              const shadeAlphas = Object.keys(aliasesInUse[alias].shadesInUse) as ShadeAlpha[];
              for (const shdeAlpha of shadeAlphas) {
                const { alpha, shade } = aliasesInUse[alias].shadesInUse[shdeAlpha];
                addColorToColorsInUse({ hue: possibleHue, shade, alpha });
              }
            }
            // const isDynamicAlias = ![...safeListAliases, Object.keys(aliases)].includes(hueOrAlias);
            // if (isDynamicAlias) {
            //   return `replace-virtualcolor-with-${hueOrAlias}:${property}-virtualcolor${shade}${alpha}`;
            // }
          }
          if (useP3Colors) return `with-P3-fallbacks:${token}`;
          return `${token}`; //takon will be process as it would without this shortcut
        },
      ],
    ],
    variants: useP3Colors
      ? [p3FallbackVariant({ prefix })] : undefined
    ,
    preflights: [
      {
        getCSS: (context) => {
          return genPreflightCSS({
            colorsInUse,
            aliasesInUse,
            darkSelector,
            lightSelector,
            prefix,
            useP3Colors,
            onlyOneTheme,
            safeListAliases,
            aliases,
          });
        },
        layer: "radix-colors",
      },

    ],
    extendTheme: (theme: Theme) => extendTheme({ theme, prefix, extend, useP3Colors, aliasesInUse }),
  };
}

function addSafeListColorsToColorsInUse({ safeListColors }: Pick<Options, 'safeListColors'>) {
  for (const color of safeListColors) {
    const match = color.match(/^([A-Za-z]+)(1|2|3|4|5|6|7|8|9|10|11|12)?(A)?$/);
    if (!match) continue;
    const [token, hue, shade, alpha] = match as [string, RadixHue | 'black' | 'white', Shade, Alpha];

    // if its a single shade
    if (shade) {
      if (["black", "white"].includes(hue) && alpha === "") continue;
      addColorToColorsInUse({ hue, shade, alpha });
    }
    // if a hue, add all shades and alphas ...
    if (!shade) {
      for (const a of ALPHAS) {
        if (["black", "white"].includes(hue) && a === "") continue;
        for (const sh of SHADES) {
          addColorToColorsInUse({ hue, shade: sh, alpha: a });
        }
      }
    }
  }
}

function addSafeListAliasesToAliasesInUse({ aliases, safeListAliases }: Pick<Options, 'aliases' | 'safeListAliases'>) {
  for (const color of safeListAliases) {
    const match = color.match(/^([A-Za-z]+)(1|2|3|4|5|6|7|8|9|10|11|12)?(A)?$/);
    if (!match) return;
    const [token, alias, shade, alpha] = match as [string, Alias, Shade, Alpha];
    if (!safeListAliases.includes(alias)) continue;
    if (!Object.keys(aliases).includes(alias)) continue;

    const hue = aliases[alias];
    // if its a single shade
    if (shade) {
      addAliasToAliasesInUse({ alias, shade, alpha, hue });
      // also add it colors in use
      addColorToColorsInUse({ hue, shade, alpha });
    }
    // if a hue, add all shades and alphas ...
    if (!shade) {
      for (const a of ALPHAS) {
        for (const sh of SHADES) {
          addAliasToAliasesInUse({ alias, shade: sh, alpha: a, hue });
          // also add it colors in use
          addColorToColorsInUse({ hue, shade: sh, alpha: a });
        }
      }
    }
  }
}

function addOtherAliasesToAliasesInUse({ aliases, safeListAliases }: Pick<Options, 'aliases' | 'safeListAliases'>) {
  for (const alias of Object.keys(aliases)) {
    if (safeListAliases.includes(alias)) continue;
    addHueToAnAliasInUse({ alias, hue: aliases[alias] });
  }

  for (const safeLIstedAlias of safeListAliases) {
    const match = safeLIstedAlias.match(/^([A-Za-z]+)(1|2|3|4|5|6|7|8|9|10|11|12)?(A)?$/);
    if (!match) continue;
    const [token, alias, shade, alpha] = match as [string, Alias, Shade, Alpha];
    if (!safeListAliases.includes(alias)) continue;
    if (!Object.keys(aliases).includes(alias)) continue;

    const hue = aliases[alias];
    // if its a single shade
    if (shade) {
      addAliasToAliasesInUse({ alias, shade, alpha, hue });
      // also add it colors in use
      addColorToColorsInUse({ hue, shade, alpha });
    }
    // if a hue, add all shades and alphas ...
    if (!shade) {
      for (const a of ALPHAS) {
        for (const sh of SHADES) {
          addAliasToAliasesInUse({ alias, shade: sh, alpha: a, hue });
          // also add it colors in use
          addColorToColorsInUse({ hue, shade: sh, alpha: a });
        }
      }
    }
  }
}

function addColorToColorsInUse({ hue, shade, alpha }: { hue: RadixHue | 'black' | 'white', shade: Shade, alpha: Alpha }) {
  colorsInUse[hue] = colorsInUse[hue] ?? {};
  colorsInUse[hue].shadesInUse = colorsInUse[hue].shadesInUse ?? {};
  colorsInUse[hue].shadesInUse[`${shade}${alpha}`] = { hue, shade, alpha };
}

function addAliasToAliasesInUse({
  alias,
  shade,
  alpha,
  hue,
}: {
  alias: Alias;
  shade: Shade;
  alpha: Alpha;
  hue?: RadixHue;
}) {
  addHueToAnAliasInUse({ alias, hue });
  aliasesInUse[alias].shadesInUse[`${shade}${alpha}`] = {
    shade,
    alpha,
    // we keep possible hues on aliasesInUse[alias].possibleHues, because each alias can be reassigned (through alias-danger-is-orange utility class) to another hue in diffrenet parts of html
  };
}

function addHueToAnAliasInUse({ alias, hue }: { alias: Alias; hue?: RadixHue }) {
  aliasesInUse[alias] = aliasesInUse[alias] ?? {};
  aliasesInUse[alias].shadesInUse = aliasesInUse[alias].shadesInUse ?? {};
  aliasesInUse[alias].possibleHues = aliasesInUse[alias].possibleHues ?? [];
  if (!!hue && !aliasesInUse[alias].possibleHues.includes(hue)) {
    aliasesInUse[alias].possibleHues.push(hue);
  }
}

function p3FallbackVariant({ prefix }: { prefix: Options['prefix'] }) {
  return {
    name: "with P3 fallbacks",
    match: (matcher: string, context: Readonly<VariantContext<Theme>>) => {
      if (!matcher.includes("with-P3-fallbacks:")) return matcher;
      return {
        matcher: matcher.replaceAll("with-P3-fallbacks:", ""),
        body: (cssEntries: CSSEntries) => {
          let cssEntriesWithP3Fallbacks = cssEntries;
          for (const entry of cssEntries) {
            const property: string = entry[0];
            let value = entry[1] ?? "";
            if (typeof value === "number") continue;
            // non alpha colors
            if (value.includes(`color(display-p3 var(--${prefix}-P3-`)) {
              const fallBackValue = value.replaceAll(`color(display-p3 var(--${prefix}-P3-`, `rgb(var(--${prefix}-`);
              cssEntriesWithP3Fallbacks = [[property, fallBackValue], ...cssEntriesWithP3Fallbacks];
              // for alpha colors
            } else if (value.includes(`var(--${prefix}-P3-`)) {
              const fallBackValue = value.replaceAll(`var(--${prefix}-P3-`, `var(--${prefix}-`);
              cssEntriesWithP3Fallbacks = [[property, fallBackValue], ...cssEntriesWithP3Fallbacks];
            }
          }
          return cssEntriesWithP3Fallbacks;
        },
      };
    },
  };
}

