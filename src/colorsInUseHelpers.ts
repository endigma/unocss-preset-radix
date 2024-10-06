import { ALPHAS, SHADES } from './consts';
import { Alias, Aliases, AliasesInUse, Alpha, ColorsInUse, Options, RadixHue, SafelistColor, Shade } from './types';

const colorsInUse = {} as ColorsInUse;
const aliasesInUse = {} as AliasesInUse;

export function getColorsInUse() {
  return colorsInUse;
}

export function getAliasesInUse() {
  return aliasesInUse;
}


export function addSafelistColors({
  safelistColors = [],
}: {
  safelistColors: readonly SafelistColor[];
}) {
  for (const color of safelistColors) {
    const match = color.match(/^([A-Za-z]+)(1|2|3|4|5|6|7|8|9|10|11|12)?(A)?$/);
    if (!match) continue;
    const [token, hue, shade, alpha] = match as [string, RadixHue | 'black' | 'white', Shade, Alpha];

    // if its a single shade
    if (shade) {
      if (['black', 'white'].includes(hue) && alpha === '') continue;
      addColor({ hue, shade, alpha });
    }
    // if a hue, add all shades and alphas ...
    if (!shade) {
      for (const a of ALPHAS) {
        if (['black', 'white'].includes(hue) && a === '') continue;
        for (const sh of SHADES) {
          addColor({ hue, shade: sh, alpha: a });
        }
      }
    }
  }
}


export function addSafelistAliases({
  aliases,
  safelistAliases = [],
}: {
  aliases: Aliases;
  safelistAliases: string[];
}) {
  for (const color of safelistAliases) {
    const match = color.match(/^([A-Za-z]+)(1|2|3|4|5|6|7|8|9|10|11|12)?(A)?$/);
    if (!match) return;
    const [token, alias, shade, alpha] = match as [string, Alias, Shade, Alpha];
    if (!safelistAliases.includes(alias)) continue;
    if (!(alias in aliases)) continue;

    const hue = aliases[alias];
    // if its a single shade
    if (shade) {
      addAlias({ alias, shade, alpha, hue });
      // also add it colors in use
      addColor({ hue, shade, alpha });
    }
    // if a hue, add all shades and alphas ...
    if (!shade) {
      for (const a of ALPHAS) {
        for (const sh of SHADES) {
          addAlias({ alias, shade: sh, alpha: a, hue });
          // also add it colors in use
          addColor({ hue, shade: sh, alpha: a });
        }
      }
    }
  }
}

export function addNotSafelistAliases({
  aliases,
  safelistAliases = [],
}: {
  aliases: Aliases;
  safelistAliases: string[];
}) {
  for (const alias in aliases) {
    if (safelistAliases.includes(alias)) continue;
    addHueToAnAliasInUse({ alias, hue: aliases[alias] });
  }

  for (const safelistedAlias of safelistAliases) {
    const match = safelistedAlias.match(/^([A-Za-z]+)(1|2|3|4|5|6|7|8|9|10|11|12)?(A)?$/);
    if (!match) continue;
    const [token, alias, shade, alpha] = match as [string, Alias, Shade, Alpha];
    if (!safelistAliases.includes(alias)) continue;
    if (!(alias in aliases)) continue;

    const hue = aliases[alias];
    // if its a single shade
    if (shade) {
      addAlias({ alias, shade, alpha, hue });
      // also add it colors in use
      addColor({ hue, shade, alpha });
    }
    // if a hue, add all shades and alphas ...
    if (!shade) {
      for (const a of ALPHAS) {
        for (const sh of SHADES) {
          addAlias({ alias, shade: sh, alpha: a, hue });
          // also add it colors in use
          addColor({ hue, shade: sh, alpha: a });
        }
      }
    }
  }
}

export function addColor({
  hue,
  shade,
  alpha,
}: {
  hue: RadixHue | 'black' | 'white';
  shade: Shade;
  alpha: Alpha;
}) {
  colorsInUse[hue] = colorsInUse[hue] ?? {};
  colorsInUse[hue].shadesInUse = colorsInUse[hue].shadesInUse ?? {};
  colorsInUse[hue].shadesInUse[`${shade}${alpha}`] = { hue, shade, alpha };
}

export function addAlias({
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

export function addHueToAnAliasInUse({ alias, hue }: { alias: Alias; hue?: RadixHue }) {
  aliasesInUse[alias] = aliasesInUse[alias] ?? {};
  aliasesInUse[alias].shadesInUse = aliasesInUse[alias].shadesInUse ?? {};
  aliasesInUse[alias].possibleHues = aliasesInUse[alias].possibleHues ?? [];
  if (!!hue && !aliasesInUse[alias].possibleHues.includes(hue)) {
    aliasesInUse[alias].possibleHues.push(hue);
  }
}
