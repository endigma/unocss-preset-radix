import { Preset } from 'unocss';
import type { Theme } from 'unocss/preset-uno';
import { type Options, Aliases, Alpha, HueOrAlias, Property, SafelistColor, Shade, Token } from './types';

import { generateCSSVariablesForColorsInUse } from './preflights';
import { AddToColorInUse, detectAndAddToColorsInUse } from './shortcuts';
import { addP3Fallbacks } from './variants';
import { extendTheme } from './extendTheme';
// import addP3FallbacksVariant from './addP3FallbacksVariant';
import * as colorsInUseHelpers from './colorsInUseHelpers';
// import detectAndAddToColorsInUseShortcut from './shortcuts';

export function presetRadix<T extends Aliases>({
  useP3Colors = false,
  prefix: _prefix = '--un-preset-radix-',
  darkSelector = '.dark-theme',
  lightSelector = ':root, .light-theme',
  safelistColors = [] as SafelistColor[],
  aliases: _aliases,
  safelistAliases: _safelistAliases,
  extend = false,
  onlyOneTheme,
}: Options<T>): Preset<Theme> {
  let prefix = _prefix.replaceAll('-', ' ').trim().replaceAll(' ', '-'); // remove hyphens from start and end.
  // const aliases = _aliases ?? {};
  const aliases = _aliases as Aliases;
  const safelistAliases = (_safelistAliases ?? []) as string[];

  colorsInUseHelpers.addSafelistColors({ safelistColors }); // add all 12 shaded and 12 alpha shades
  colorsInUseHelpers.addSafelistAliases({ safelistAliases, aliases }); // add all 12 shaded and 12 alpha shades
  colorsInUseHelpers.addNotSafelistAliases({ safelistAliases, aliases }); // this one only adds hues-shade-alphas that are used in project

  return {
    name: 'unocss-preset-radix',
    // sortLayers: (layers: string[]) => {
    //   return ['radix-colors' , ...layers.filter((layer) => layer !== 'radix-colors')];
    // },
    layers: {
      preflights: 1,
      'radix-colors': 2,
      default: 3,
    },
    shortcuts: [
      // This shortcut exsit so generated css for colors to have same order.
      [/^(.*)-(transparent|white|black|current|current-color|inherit)$/, ([token]) => `${token}`, { layer: 'default' }],
      // This shortcut detects the usage of radix colors or aliases and add used colors to colros in use. Preflight will generate css variables for them.
      // ([a-z]+)|([a-z]+(-[a-z]+)+) is regex for a kebab-case word made of only small letters and hypens.
      [
        /^([a-z-]+)-([a-z]+)(1|2|3|4|5|6|7|8|9|10|11|12)(A)?$/,
        (match) => {
          if (!match) return;
          const [token, property, hueOrAlias, shade, alpha = ''] = match as [Token, Property, HueOrAlias, Shade, Alpha];
          return AddToColorInUse({ token, hueOrAlias, shade, alpha, useP3Colors });
        },
        { layer: 'default' },
      ],
    ],
    rules: [
      // this shortcut detects usage of radix colors or aliases as css variables.
      // ex: var(--un-preset-radix-pink9), var(--un-preset-radix-pink9A )
      [
        /^var\(--([A-Za-z0-9\-\_]+)-([a-z]+)(1|2|3|4|5|6|7|8|9|10|11|12)(A)?(\))?$/,
        (match) => {
          if (!match) return;
          const [token, matchedPrefix, hueOrAlias, shade, alpha = '', closingBracket] = match as [
            Token,
            string,
            HueOrAlias,
            Shade,
            Alpha,
            string
          ];
          console.log('🚀 ~ in the rule hueOrAlias:', token);
          if (matchedPrefix !== prefix) return;
          AddToColorInUse({ token, hueOrAlias, shade, alpha, useP3Colors });
          // do not return anything.
          return ""
        },
        { layer: 'default' },
      ],
    ],
    variants: useP3Colors ? [addP3Fallbacks({ prefix })] : undefined,
    preflights: [
      {
        getCSS: (context) => {
          const colorsInUse = colorsInUseHelpers.getColorsInUse();
          const aliasesInUse = colorsInUseHelpers.getAliasesInUse();
          // this generates css variables for all colors and aliases in use
          return generateCSSVariablesForColorsInUse({
            colorsInUse,
            aliasesInUse,
            darkSelector,
            lightSelector,
            prefix,
            useP3Colors,
            onlyOneTheme,
            safelistAliases,
            aliases,
          });
        },
        layer: 'radix-colors',
      },
    ],
    extendTheme: (theme: Theme) => {
      const aliasesInUse = colorsInUseHelpers.getAliasesInUse();
      return extendTheme({ theme, prefix, extend, useP3Colors, aliasesInUse });
    },
  };
}
