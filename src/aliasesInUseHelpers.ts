import {
  Alias,
  Alpha,
  // ColorsInUse,
  RadixHue,
  Shade,
  ShadeAlpha,
} from './types';

type AliasProperties = {
  shade: Shade;
  alpha: Alpha;
};

type Selector = string;

type AliasInUse = {
  shadesInUse: Record<ShadeAlpha, AliasProperties>;
  possibleHues: RadixHue[]
  scopes: Record<Selector, RadixHue>;
};

type AliasesInUse = Record<string, AliasInUse>;

const aliasesInUse = {} as AliasesInUse;

export function getAliasesInUse() {
  return aliasesInUse as Readonly<AliasesInUse>;
}

export function addShadeToAnAlias({ alias, shade, alpha }: { alias: Alias; shade: Shade; alpha: Alpha }) {
  aliasesInUse[alias] = aliasesInUse[alias] ?? {};
  aliasesInUse[alias].shadesInUse = aliasesInUse[alias].shadesInUse ?? {};
  aliasesInUse[alias].possibleHues = aliasesInUse[alias].possibleHues ?? [];

  aliasesInUse[alias].shadesInUse[`${shade}${alpha}` as ShadeAlpha] = {
    shade,
    alpha,
    // we keep possible hues on aliasesInUse[alias].possibleHues, because each alias can be reassigned (through alias-danger-is-orange utility class) to another hue in diffrenet parts of html
  };
}

export function addPossibleHueToAnAlias({ alias, possibleHue }: { alias: Alias; possibleHue: RadixHue, scope?: string }) {
  aliasesInUse[alias] = aliasesInUse[alias] ?? {};
  aliasesInUse[alias].shadesInUse = aliasesInUse[alias].shadesInUse ?? {};
  aliasesInUse[alias].possibleHues = aliasesInUse[alias].possibleHues ?? [];

  if (!aliasesInUse[alias].possibleHues.includes(possibleHue)) {
    aliasesInUse[alias].possibleHues.push(possibleHue);
  }
}

export function addScope({ alias, selector, hue }: { alias: Alias; selector: string, hue: RadixHue }) {
  aliasesInUse[alias] = aliasesInUse[alias] ?? {};
  aliasesInUse[alias].scopes = aliasesInUse[alias].scopes ?? [];
  if (!aliasesInUse[alias].scopes[selector]) {
    aliasesInUse[alias].scopes[selector] = hue;
  }
}

