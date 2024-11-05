import { Preset, RuleContext } from "unocss";
import type { Theme } from "unocss/preset-uno";
import { type Options, Aliases, Alpha, HueOrAlias, RadixHue, Step } from "./types";

import { generateCSSVariablesForColorsInUse } from "./preflights";
import { extendTheme } from "./extendTheme";
import * as colorsInUseHelpers from "./colorsInUseHelpers";
import * as aliasesInUseHelpers from "./aliasesInUseHelpers";
import {
  filterValidAliases,
  filterValidSafelistAliases,
  filterValidSafelistColors,
  isValidAlias,
  isValidAliasName,
  isValidColor,
  isValidPrefix,
  isValidRadixHue,
} from "./validation";

export function presetRadix<T extends Aliases>({
  useP3Colors = false,
  prefix: _prefix = "--un-preset-radix-",
  darkSelector = ".dark-theme",
  lightSelector = ":root, .light-theme",
  aliases: _aliases,
  safelist,
  extend = false,
  onlyOneTheme,
  layer,
}: Options<T>): Preset<Theme> {
  let prefix = isValidPrefix(_prefix) ? _prefix : "--un-preset-radix-";
  // remove hyphens from start and end of prefix.
  prefix = prefix.replaceAll("-", " ").trim().replaceAll(" ", "-");

  // filter valid user inputs + flatten them (blue -> blue1, blue2, ..., blue12,... , blue12A, blue-fg)
  const safelistColors = filterValidSafelistColors((safelist ?? []) as string[]);
  const aliases = filterValidAliases(_aliases ?? {});
  const safelistAliases = filterValidSafelistAliases((safelist ?? []) as string[], aliases);

  // add safelist colors to colors in use
  for (const safelistColor in safelistColors) {
    const { hue, step, alpha } = safelistColors[safelistColor];
    colorsInUseHelpers.addColor({ hue, step, alpha });
  }

  // add safelist aliases to aliases in use + add respective hue to AliasesInUse
  for (const safelistAlias in safelistAliases) {
    const { alias, step, alpha } = safelistAliases[safelistAlias];
    const hue = aliases[alias];

    aliasesInUseHelpers.addPossibleHueToAnAlias({ alias, possibleHue: hue });
    aliasesInUseHelpers.addStepToAnAlias({ alias, step, alpha });
  }

  // also add the color right away whether it is used in project or not.
  for (const safelistAlias in safelistAliases) {
    const { alias, step, alpha } = safelistAliases[safelistAlias];
    // colorsInUseHelpers.addAllPossibleColorsOfAnAlias({ alias });
  }

  // add a possible hue for other alias
  // don't add any color right away. Colors are added when alias usage is detected
  for (const alias in aliases) {
    aliasesInUseHelpers.addPossibleHueToAnAlias({ alias, possibleHue: aliases[alias] });
  }

  return {
    name: "unocss-preset-radix",
    layers: layer
      ? {
          preflights: 1,
          [layer]: 2,
          default: 3,
        }
      : undefined,
    shortcuts: [
      // This shortcut exist so generated css for colors to have same order.
      [/^(.*)-(transparent|white|black|current|current-color|inherit)$/, ([token]) => `${token}`, { layer: "default" }],
      // Detect usage of radix colors or aliases and handle it (by adding to colors in use). Preflight will generate css variables for based off colorsInUse and aliasesInUse.
      [
        /^([a-z]+(-[a-z]+)*)-([a-z]+)(1|2|3|4|5|6|7|8|9|10|11|12|-fg)(A)?$/,
        (match) => {
          if (!match) return;
          const [token, property, propertyInnerGroup, hueOrAlias, step, alpha = ""] = match as [
            string,
            string,
            string,
            HueOrAlias,
            Step,
            Alpha
          ];

          if (isValidColor({ hue: hueOrAlias, step, alpha })) {
            const hue = hueOrAlias as RadixHue | "white" | "black";
            colorsInUseHelpers.addColor({ hue, step, alpha });
          }

          if (isValidAlias({ alias: hueOrAlias, step, alpha, aliases })) {
            const alias = hueOrAlias;
            aliasesInUseHelpers.addStepToAnAlias({ alias, step, alpha });
          }

          return token;
        },
        { layer: "default" },
      ],
      // detect usage of dynamic aliasing and handle it.
      // using unocss shortcut instead of rule since shortcut runs earlier. So we are aware of all dynamic aliasing usage before processing alias usages
      // example: alias-warning-amber
      [
        /^alias-([a-z]+(-[a-z]+)*)-([a-z]+)$/,
        (match) => {
          if (!match) return;
          const [token, alias, aliasInnerGroup, hue] = match as [string, string, string, RadixHue];
          if (!isValidRadixHue(hue)) return "";
          if (!isValidAliasName(alias)) return "";
          aliasesInUseHelpers.addPossibleHueToAnAlias({ alias, possibleHue: hue });
          aliasesInUseHelpers.addScope({ alias, selector: `.${token}`, hue });
          return;
        },
        { layer: "default" },
      ],
    ],

    rules: [
      // detect usage of radix colors or aliases as css variables and handle it.
      // examples: var(--un-preset-radix-pink9), var(--un-preset-radix-warning9A ), var(--uno-preset-radix-danger-fg, white)
      [
        /^var\(--([A-Za-z0-9\-\_]+)-([a-z]+)(1|2|3|4|5|6|7|8|9|10|11|12|-fg)(A)?(\)|,)?$/,
        (match, context: RuleContext<Theme>) => {
          if (!match) return;
          const [token, matchedPrefix, hueOrAlias, step, alpha = "", trailingBracketOrComma] = match as [
            string,
            string,
            HueOrAlias,
            Step,
            Alpha,
            string
          ];
          if (matchedPrefix !== prefix) return;

          if (isValidColor({ hue: hueOrAlias, step, alpha })) {
            const hue = hueOrAlias as RadixHue | "white" | "black";
            colorsInUseHelpers.addColor({ hue, step, alpha });
          }

          if (isValidAlias({ alias: hueOrAlias, step, alpha, aliases })) {
            const alias = hueOrAlias;
            if (!(alias in aliases)) {
              context.theme.colors = { ...context.theme.colors, "my-color": "red" };
            }
            aliasesInUseHelpers.addStepToAnAlias({ alias, step, alpha });
          }

          return "";
        },
        { layer: "default" },
      ],
    ],
    extractors: [
      // extracts usage of css variables with radix color format.
      {
        name: "unocss-preset-radix-css-variables-extractor",
        order: 1,
        extract({ code }) {
          const mySplitRE = /var\(\s?--([A-Za-z0-9\-\_]+)-([a-z]+)(1|2|3|4|5|6|7|8|9|10|11|12|-fg)(A)?[\s\)\,]/g;
          return code.match(mySplitRE)?.map((item) => {
            // remove spaces from start and end, remove trailing comma and remove trailing closing bracket so the css rule can catch it
            return item.replaceAll(" ", "").replace(")", "").replace(",", "");
          });
        },
      },
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
