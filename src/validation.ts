import { ALPHAS, RADIX_HUES, STEPS } from "./consts";
import { Aliases, Alpha, RadixHue, Step } from "./types";
import * as aliasesInUseHelpers from "./aliasesInUseHelpers";

export function isValidPrefix(prefix: any) {
  if (typeof prefix !== "string") return false;
  if (!prefix.match(/^[a-zA-Z0-9-_]+$/)) return false;
  return true;
}

export function isValidAliasName(aliasName: string) {
  if (typeof aliasName !== "string") return false;
  if (["white", "black", ...RADIX_HUES].includes(aliasName)) return false;
  if (!aliasName.match(/^[a-z]+(-[a-z]+)*$/)) return false;
  return true;
}

export function isValidRadixHue(hue: string) {
  return RADIX_HUES.some(h => h === hue);
}

export function isValidColor({ hue, step, alpha }: { hue: string; step: Step; alpha: Alpha }) {
  if (!isValidRadixHue(hue) && !["black", "white"].includes(hue)) return false;
  if (step === "-fg" && alpha === "A") return false;
  if (["black", "white"].includes(hue) && alpha === "" && step !== "-fg") return false;
  return true;
}

export function isValidAlias({
  alias,
  step,
  alpha,
  aliases,
}: {
  alias: string;
  step: Step;
  alpha: Alpha;
  aliases: Aliases;
}) {
  const aliasesInUse = aliasesInUseHelpers.getAliasesInUse();

  if (!isValidAliasName(alias)) return false;
  if (!(alias in filterValidAliases(aliases)) && !(alias in aliasesInUse)) return false;
  if (step === "-fg" && alpha === "A") return false;
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

type RadixColorProperties = { hue: RadixHue | "black" | "white"; step: Step | "-fg"; alpha: Alpha };

export function filterValidSafelistColors(safelistColors: string[]) {
  const validSafelistColors = {} as Record<string, RadixColorProperties>;
  for (const safelistColor of safelistColors) {
    const match = safelistColor.match(/^([a-z]+)(1|2|3|4|5|6|7|8|9|10|11|12|-fg)?(A)?$/);
    if (!match) continue;
    const [token, hue, step = "", alpha = ""] = match as [string, RadixHue | "black" | "white", Step | "", Alpha];

    // if its a single step
    if (step) {
      if (!isValidColor({ hue, step, alpha })) continue;
      validSafelistColors[`${hue}${step}${alpha}`] = { hue, step, alpha };
    }
    if (!step) {
      for (const a of ALPHAS) {
        for (const sh of STEPS) {
          if (!isValidColor({ hue, step: sh, alpha: a })) continue;
          validSafelistColors[`${hue}${sh}${a}`] = { hue, step: sh, alpha: a };
        }
      }
    }
  }
  return validSafelistColors;
}

export type RadixAliasProperties = { alias: string; step: Step | "-fg"; alpha: Alpha };

export function filterValidSafelistAliases(safelistAliases: string[], aliases: Aliases) {
  const validSafelistAliases = {} as Record<string, RadixAliasProperties>;

  for (const safelistAlias of safelistAliases) {
    const match = safelistAlias.match(/^([a-z]+(-[a-z]+)*)(1|2|3|4|5|6|7|8|9|10|11|12|-fg)?(A)?$/);
    if (!match) continue;

    const [token, alias, aliasInnerGroup, step = "", alpha = ""] = match as [string, string, string, Step | "", Alpha];

    if (step) {
      if (!isValidAlias({ alias, step, alpha, aliases })) continue;
      validSafelistAliases[`${alias}${step}${alpha}`] = { alias, step, alpha };
    }
    if (!step) {
      for (const a of ALPHAS) {
        for (const sh of STEPS) {
          if (!isValidAlias({ alias, step: sh, alpha: a, aliases })) continue;
          validSafelistAliases[`${alias}${sh}${a}`] = { alias, step: sh, alpha: a };
        }
      }
    }
  }
  return validSafelistAliases;
}
