import { ALPHAS, RADIX_HUES, SHADES } from './consts';
import { Aliases, Alpha, RadixHue,  Shade } from './types';
import * as aliasesInUseHelpers from './aliasesInUseHelpers';

export function isValidPrefix(prefix: any){ 
  if (typeof prefix !== "string") return false;
  if (!prefix.match(/^[a-zA-Z0-9-_]+$/)) return false;
  return true;
}

export function isValidAliasName(aliasName: string) {
  if (typeof aliasName !== 'string') return false
  if (['white', 'black', ...RADIX_HUES].includes(aliasName)) return false;
  if (!aliasName.match(/^[a-z]+(-[a-z]+)*$/)) return false;
  return true;
}

export function isValidRadixHue(hue: string) {
  // @ts-ignore
  return RADIX_HUES.includes(hue);
}

export function isValidColor({ hue, shade, alpha }: { hue: string; shade: Shade; alpha: Alpha }) {
  if (!isValidRadixHue(hue) && !['black', 'white'].includes(hue)) return false;
  if (shade === '-fg' && alpha === 'A') return false;
  if (['black', 'white'].includes(hue) && alpha === '' && shade !== '-fg') return false;
  return true;
}

export function isValidAlias({
  alias,
  shade,
  alpha,
  aliases,
}: {
  alias: string;
  shade: Shade;
  alpha: Alpha;
  aliases: Aliases;
}) {
  const aliasesInUse = aliasesInUseHelpers.getAliasesInUse();
  
  if (!isValidAliasName(alias)) return false;
  if (!(alias in filterValidAliases(aliases)) && !(alias in aliasesInUse)) return false;
  if (shade === '-fg' && alpha === 'A') return false;
  return true;
}

export function filterValidAliases(aliases: Aliases) {
  const validAliases: Aliases = {};
  for (const alias in aliases) {
    const hue = aliases[alias];
    if (isValidAliasName(alias) && isValidRadixHue(hue)) validAliases[alias] = hue;
  }
  return validAliases;
}

type RadixColorProperties = { hue: RadixHue | 'black' | 'white'; shade: Shade | '-fg'; alpha: Alpha };

export function filterValidSafelistColors(safelistColors: string[]) {
  const validSafelistColors = {} as Record<string, RadixColorProperties>;
  for (const safelistColor of safelistColors) {
    const match = safelistColor.match(/^([a-z]+)(1|2|3|4|5|6|7|8|9|10|11|12|-fg)?(A)?$/);
    if (!match) continue;
    const [token, hue, shade = '', alpha = ''] = match as [string, RadixHue | 'black' | 'white', Shade | '', Alpha];

    // if its a single shade
    if (shade) {
      if (!isValidColor({ hue, shade, alpha })) continue;
      validSafelistColors[`${hue}${shade}${alpha}`] = { hue, shade, alpha };
    }
    if (!shade) {
      for (const a of ALPHAS) {
        for (const sh of SHADES) {
          if (!isValidColor({ hue, shade: sh, alpha: a })) continue;
          validSafelistColors[`${hue}${sh}${a}`] = { hue, shade: sh, alpha: a };
        }
      }
    }
  }
  return validSafelistColors;
}

export type RadixAliasProperties = { alias: string; shade: Shade | '-fg'; alpha: Alpha };

export function filterValidSafelistAliases(safelistAliases: string[], aliases: Aliases) {
  const validSafelistAliases = {} as Record<string, RadixAliasProperties>;

  for (const safelistAlias of safelistAliases) {
    const match = safelistAlias.match(/^([a-z]+(-[a-z]+)*)(1|2|3|4|5|6|7|8|9|10|11|12|-fg)?(A)?$/);
    if (!match) continue;

    const [token, alias, aliasInnerGroup , shade = '', alpha = ''] = match as [string, string ,string, Shade | '', Alpha];

    if (shade) {
      if (!isValidAlias({ alias, shade, alpha, aliases })) continue;
      validSafelistAliases[`${alias}${shade}${alpha}`] = { alias, shade, alpha };
    }
    if (!shade) {
      for (const a of ALPHAS) {
        for (const sh of SHADES) {
          if (!isValidAlias({ alias, shade: sh, alpha: a, aliases })) continue;
          validSafelistAliases[`${alias}${sh}${a}`] = { alias, shade: sh, alpha: a };
        }
      }
    }
  }
  return validSafelistAliases;
}
