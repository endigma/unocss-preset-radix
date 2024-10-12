import { Preset } from 'unocss';
import type { Theme } from 'unocss/preset-uno';
import { type Options, Aliases, Alpha, HueOrAlias, Property, RadixHue, Shade } from './types';

import { generateCSSVariablesForColorsInUse } from './preflights';
import { addP3Fallbacks } from './variants';
import { extendTheme } from './extendTheme';
import * as colorsInUseHelpers from './colorsInUseHelpers';
import * as aliasesInUseHelpers from './aliasesInUseHelpers';
import {
  filterValidAliases,
  filterValidSafelistAliases,
  filterValidSafelistColors,
  isValidAlias,
  isValidAliasName,
  isValidColor,
  isValidPrefix,
  isValidRadixHue,
} from './validation';

export function presetRadix<T extends Aliases>({
  useP3Colors = false,
  prefix: _prefix = '--un-preset-radix-',
  darkSelector = '.dark-theme',
  lightSelector = ':root, .light-theme',
  safelistColors: _safelistColors,
  aliases: _aliases,
  safelistAliases: _safelistAliases,
  extend = false,
  onlyOneTheme,
  layer = 'radix-colors'
}: Options<T>): Preset<Theme> {
  let prefix = isValidPrefix(_prefix) ? _prefix : '--un-preset-radix-';
  // remove hyphens from start and end of prefix.
  prefix = prefix.replaceAll('-', ' ').trim().replaceAll(' ', '-');

  // filter valid user inputs + flatten them (blue -> blue1, blue2, ..., blue12,... , blue12A, blue-fg)
  const safelistColors = filterValidSafelistColors((_safelistColors ?? []) as string[]);
  const aliases = filterValidAliases(_aliases ?? {});
  const safelistAliases = filterValidSafelistAliases((_safelistAliases ?? []) as string[], aliases);

  // add safelist colors to colors in use
  for (const safelistColor in safelistColors) {
    const { hue, shade, alpha } = safelistColors[safelistColor];
    colorsInUseHelpers.addColor({ hue, shade, alpha });
  }

  // add safelist aliases to aliaes in use + add respective hue to AliasesInUse
  for (const safelistAlias in safelistAliases) {
    const { alias, shade, alpha } = safelistAliases[safelistAlias];
    const hue = aliases[alias];

    aliasesInUseHelpers.addPossibleHueToAnAlias({ alias, possibleHue: hue });
    aliasesInUseHelpers.addShadeToAnAlias({ alias, shade, alpha });
  }

  // also add the color right away whether it is used in project or not.
  for (const safelistAlias in safelistAliases) {
    const { alias, shade, alpha } = safelistAliases[safelistAlias];
    // colorsInUseHelpers.addAllPossibleColorsOfAnAlias({ alias });
  }

  // add a possible hue for other aliase
  // don't add any color right away. Colors are added when aliase usage is detected
  for (const alias in aliases) {
    aliasesInUseHelpers.addPossibleHueToAnAlias({ alias, possibleHue: aliases[alias] });
  }


  return {
    name: 'unocss-preset-radix',
    layers: {
      preflights: 1,
      [layer]: 2,
      default: 3,
    },
    shortcuts: [
      // This shortcut exsit so generated css for colors to have same order.
      [/^(.*)-(transparent|white|black|current|current-color|inherit)$/, ([token]) => `${token}`, { layer: 'default' }],
      // Detect usage of radix colors or aliases and handle it (by adding to colors in use). Preflight will generate css variables for based off colorsInUse and aliasesInUse.
      [
        /^([a-z]+(-[a-z]+)*)-([a-z]+)(1|2|3|4|5|6|7|8|9|10|11|12|-fg)(A)?$/,
        (match) => {
          if (!match) return;
          const [token, property, propertyInnerGroup, hueOrAlias, shade, alpha = ''] = match as [
            string,
            string,
            string,
            HueOrAlias,
            Shade,
            Alpha
          ];

          if (isValidColor({ hue: hueOrAlias, shade, alpha })) {
            const hue = hueOrAlias as RadixHue | 'white' | 'black';
            colorsInUseHelpers.addColor({ hue, shade, alpha });
          }

          if (isValidAlias({ alias: hueOrAlias, shade, alpha, aliases })) {
            const alias = hueOrAlias;
            aliasesInUseHelpers.addShadeToAnAlias({ alias, shade, alpha });
          }

          return token;
        },
        { layer: 'default' },
      ],
      // detect usage of dynamic aliasing and handle it.
      // using unocss shortcut instead of rule since shortcut runs earlier. So we are aware of all dynamic aliasing usage before processing alias usages
      // example: alias-warning-amber
      [
        /^alias-([a-z]+(-[a-z]+)*)-([a-z]+)$/,
        (match) => {
          if (!match) return;
          const [token, alias, aliasInnerGroup, hue] = match as [string, string, string, RadixHue];
          if (!isValidRadixHue(hue)) return '';
          if (!isValidAliasName(alias)) return '';
          aliasesInUseHelpers.addPossibleHueToAnAlias({ alias, possibleHue: hue });
          aliasesInUseHelpers.addScope({ alias, selector: `.${token}`, hue });
          return;
        },
        { layer: 'default' },
      ],
    ],
    preflights: [
      {
        getCSS: (context) => {
          // generate css variables for all colors and aliases in use
          return generateCSSVariablesForColorsInUse({
            darkSelector,
            lightSelector,
            prefix,
            useP3Colors,
            onlyOneTheme,
            aliases,
          });
        },  
        layer: layer,
      },
    ],
    extendTheme: (theme: Theme) => {
      return extendTheme({ theme, prefix, extend });
    },
  };
}
