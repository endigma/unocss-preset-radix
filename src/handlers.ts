import { type Alpha, type Shade, type RadixHue } from './types';
import * as colorsInUseHelpers from './colorsInUseHelpers';
import * as aliasesInUseHelpers from './aliasesInUseHelpers';

 function handleColorUsage({
  hue,
  shade,
  alpha = '',
}: {
  hue: RadixHue | 'white' | 'black';
  shade: Shade;
  alpha?: Alpha;
}) {
  colorsInUseHelpers.addColor({
    hue,
    shade,
    alpha,
  });
}

 function handleAliasUsage({ alias, shade, alpha = '' }: { alias: string; shade: Shade; alpha?: Alpha }) {
  aliasesInUseHelpers.addShadeToAnAlias({ alias, shade, alpha });
  // colorsInUseHelpers.addAllPossibleColorsOfAnAlias({ alias });
}

 function handleDynamicAliasingUsage({ alias, hue }: { alias: string; hue: RadixHue }) {
  aliasesInUseHelpers.addPossibleHueToAnAlias({ alias, possibleHue: hue });
  // colorsInUseHelpers.addAllPossibleColorsOfAnAlias({ alias });
}
