import { DynamicShortcut, RuleContext } from 'unocss';
import { type Alpha, type Shade, type RadixHue, type Token, Property, HueOrAlias, ShadeAlpha } from './types';
import { Theme } from 'unocss/preset-uno';
import * as colorsInUseHelpers from './colorsInUseHelpers';
import { RADIX_HUES } from './consts';

export function detectAndAddToColorsInUse<T>({
  useP3Colors,
  prefix,
}: {
  useP3Colors: boolean;
  prefix: string;
}): DynamicShortcut<Theme> {
  const aliasesInUse = colorsInUseHelpers.getAliasesInUse();

  return [
    /^([a-zA-Z-]+)-([A-Za-z]+)(1|2|3|4|5|6|7|8|9|10|11|12)(A)?$/,
    (match, context: RuleContext) => {
      
      if (!match) return;
      const [token, property, hueOrAlias, shade, alpha = ''] = match as [Token, Property, HueOrAlias, Shade, Alpha];
      console.log("🚀 ~ property:", property)
      
      // do nothing for anything other than radix huse, black and white and aliases
      if (!['black', 'white', ...RADIX_HUES, ...Object.keys(aliasesInUse)].includes(hueOrAlias)) return token;

      // filters out white and black without alpha, early and no need to worry about them later on.
      if (['black', 'white'].includes(hueOrAlias) && alpha === '') return token;

      if (['black', 'white', ...RADIX_HUES].includes(hueOrAlias)) {
        colorsInUseHelpers.addColor({
          hue: hueOrAlias as RadixHue | 'white' | 'black',
          shade,
          alpha,
        });
      }
      if (Object.keys(aliasesInUse).includes(hueOrAlias)) {
        const alias = hueOrAlias;
        colorsInUseHelpers.addAlias({ alias, shade, alpha }); // note aliases can be reset to another hue (with alias-danger-is-yellow class). We keep track of all hues assosiated to a alias as possible Hues to generate all of it.

        // add all possible hue-shades to colorsInUse.
        for (const possibleHue of aliasesInUse[alias].possibleHues) {
          const shadeAlphas = Object.keys(aliasesInUse[alias].shadesInUse) as ShadeAlpha[];
          for (const shdeAlpha of shadeAlphas) {
            const { alpha, shade } = aliasesInUse[alias].shadesInUse[shdeAlpha];
            colorsInUseHelpers.addColor({ hue: possibleHue, shade, alpha });
          }
        }
        // const isDynamicAlias = ![...safelistAliases, Object.keys(aliases)].includes(hueOrAlias);
        // if (isDynamicAlias) {
        //   return `replace-virtualcolor-with-${hueOrAlias}:${property}-virtualcolor${shade}${alpha}`;
        // }
      }
      if (useP3Colors) return `with-P3-fallbacks:${token}`; //add a variant so later we can add p# fallbacks.
      return `${token}`; //takon will be process as it would without this shortcut
    },
  ];
}
