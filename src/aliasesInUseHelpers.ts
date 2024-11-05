import {
  Alias,
  Alpha,
  // ColorsInUse,
  RadixHue,
  Step,
  StepAlpha,
} from "./types";

type AliasProperties = {
  step: Step;
  alpha: Alpha;
};

type Selector = string;

type AliasInUse = {
  stepsInUse: Record<StepAlpha, AliasProperties>;
  possibleHues: RadixHue[];
  scopes: Record<Selector, RadixHue>;
};

type AliasesInUse = Record<string, AliasInUse>;

const aliasesInUse = {} as AliasesInUse;

export function getAliasesInUse() {
  return aliasesInUse as Readonly<AliasesInUse>;
}

export function addStepToAnAlias({ alias, step, alpha }: { alias: Alias; step: Step; alpha: Alpha }) {
  aliasesInUse[alias] = aliasesInUse[alias] ?? {};
  aliasesInUse[alias].stepsInUse = aliasesInUse[alias].stepsInUse ?? {};
  aliasesInUse[alias].possibleHues = aliasesInUse[alias].possibleHues ?? [];

  aliasesInUse[alias].stepsInUse[`${step}${alpha}` as StepAlpha] = {
    step,
    alpha,
    // we keep possible hues on aliasesInUse[alias].possibleHues, because each alias can be reassigned (through alias-danger-is-orange utility class) to another hue in different parts of html
  };
}

export function addPossibleHueToAnAlias({
  alias,
  possibleHue,
}: {
  alias: Alias;
  possibleHue: RadixHue;
  scope?: string;
}) {
  aliasesInUse[alias] = aliasesInUse[alias] ?? {};
  aliasesInUse[alias].stepsInUse = aliasesInUse[alias].stepsInUse ?? {};
  aliasesInUse[alias].possibleHues = aliasesInUse[alias].possibleHues ?? [];

  if (!aliasesInUse[alias].possibleHues.includes(possibleHue)) {
    aliasesInUse[alias].possibleHues.push(possibleHue);
  }
}

export function addScope({ alias, selector, hue }: { alias: Alias; selector: string; hue: RadixHue }) {
  aliasesInUse[alias] = aliasesInUse[alias] ?? {};
  aliasesInUse[alias].scopes = aliasesInUse[alias].scopes ?? [];
  if (!aliasesInUse[alias].scopes[selector]) {
    aliasesInUse[alias].scopes[selector] = hue;
  }
}
