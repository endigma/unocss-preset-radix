import { Preset } from 'unocss';
import type { Theme } from 'unocss/preset-uno';
import {
  type Alpha,
  type P3,
  type Shade,
  type Options,
  Aliases,
} from './types';

import { generateCSSVariablesForColorsInUse } from './preflights';
import { detectAndAddToColorsInUse } from './shortcuts';
import { addP3Fallbacks } from './variants';
import { extendTheme } from './extendTheme';
// import addP3FallbacksVariant from './addP3FallbacksVariant';
import * as colorsInUseHelpers from './colorsInUseHelpers';
// import detectAndAddToColorsInUseShortcut from './shortcuts';

const ALPHAS: Alpha[] = ['', 'A'];
const P3S: P3[] = ['', 'P3'];
const SHADES: Shade[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];



export function presetRadix<T extends Aliases>({
  useP3Colors = false,
  prefix: _prefix = '--un-preset-radix-',
  darkSelector = '.dark-theme',
  lightSelector = ':root, .light-theme',
  safelistColors = [],
  aliases: _aliases,
  safelistAliases: _safelistAliases,
  extend = false,
  onlyOneTheme,
}: Options<T>): Preset<Theme> {
  let prefix = _prefix.replaceAll('-', ' ').trim().replaceAll(' ', '-'); // remove hyphens from start and end.
  const aliases = _aliases ?? {};
  const safelistAliases = _safelistAliases ?? [];

  colorsInUseHelpers.addsafelistColors<T>({ safelistColors }); // add all 12 shaded and 12 alpha shades
  colorsInUseHelpers.addsafelistAliases<T>({ safelistAliases, aliases }); // add all 12 shaded and 12 alpha shades
  colorsInUseHelpers.addNotsafelistAliases<T>({ safelistAliases, aliases }); // this one only adds hues-shade-alphas that are used in project

  const aliasesInUse = colorsInUseHelpers.getAliasesInUse();
  return {
    name: 'unocss-preset-radix',
    shortcuts: [
      // This shortcut exsit so generated css for colors to have same order.
      [/^(.*)-(transparent|white|black|current|current-color|inherit)$/, ([token]) => `${token}`],
      // This shortcut detects the usage of radix colors or aliases and add used colors to colros in use. Preflight will generate css variables for them.
      detectAndAddToColorsInUse({ aliasesInUse, useP3Colors, prefix }),
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
    }
  };
}
