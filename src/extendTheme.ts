import { Theme } from 'unocss/preset-uno';
import { RADIX_HUES } from './consts';
import * as aliasesInUseHelpers from './aliasesInUseHelpers';


export function extendTheme({
  theme,
  prefix,
  extend,
  useP3Colors = false,
}: {
  theme: Theme;
  prefix: string;
  extend: boolean;
  useP3Colors: boolean;
}) {
  const aliasesInUse = aliasesInUseHelpers.getAliasesInUse();

  theme.colors = {
    ...(extend ? theme?.colors : []),
    transparent: "transparent",
    current: "currentColor",
    currentcolor: "currentColor",
    "current-color": "currentColor",
    inherit: "inherit",

    ...Object.fromEntries(
      [...RADIX_HUES, ...Object.keys(aliasesInUse)].map((hueOrAlias) => {
        let colorsOfSameHueInOriginalTheme = {};
        if (theme.colors?.[hueOrAlias]) {
          if (typeof theme.colors?.[hueOrAlias] === "string") {
            colorsOfSameHueInOriginalTheme = { DEFAULT: theme.colors?.[hueOrAlias] };
          } else {
            colorsOfSameHueInOriginalTheme = theme.colors?.[hueOrAlias];
          }
        }

        return [
          hueOrAlias,
          useP3Colors
            ? {
              ...(extend ? colorsOfSameHueInOriginalTheme : {}),

              "fg": `color(display-p3 var(--${prefix}-P3-${hueOrAlias}-fg) / <alpha-value>)`,
              
              "1": `color(display-p3 var(--${prefix}-P3-${hueOrAlias}1) / <alpha-value>)`,
              "2": `color(display-p3 var(--${prefix}-P3-${hueOrAlias}2) / <alpha-value>)`,
              "3": `color(display-p3 var(--${prefix}-P3-${hueOrAlias}3) / <alpha-value>)`,
              "4": `color(display-p3 var(--${prefix}-P3-${hueOrAlias}4) / <alpha-value>)`,
              "5": `color(display-p3 var(--${prefix}-P3-${hueOrAlias}5) / <alpha-value>)`,
              "6": `color(display-p3 var(--${prefix}-P3-${hueOrAlias}6) / <alpha-value>)`,
              "7": `color(display-p3 var(--${prefix}-P3-${hueOrAlias}7) / <alpha-value>)`,
              "8": `color(display-p3 var(--${prefix}-P3-${hueOrAlias}8) / <alpha-value>)`,
              "9": `color(display-p3 var(--${prefix}-P3-${hueOrAlias}9) / <alpha-value>)`,
              "10": `color(display-p3 var(--${prefix}-P3-${hueOrAlias}10) / <alpha-value>)`,
              "11": `color(display-p3 var(--${prefix}-P3-${hueOrAlias}11) / <alpha-value>)`,
              "12": `color(display-p3 var(--${prefix}-P3-${hueOrAlias}12) / <alpha-value>)`,

              // put colors with alpha values inside var(...) so, unocss don't add extra opacity and break it.
              "1A": `var(--${prefix}-P3-${hueOrAlias}1A)`,
              "2A": `var(--${prefix}-P3-${hueOrAlias}2A)`,
              "3A": `var(--${prefix}-P3-${hueOrAlias}3A)`,
              "4A": `var(--${prefix}-P3-${hueOrAlias}4A)`,
              "5A": `var(--${prefix}-P3-${hueOrAlias}5A)`,
              "6A": `var(--${prefix}-P3-${hueOrAlias}6A)`,
              "7A": `var(--${prefix}-P3-${hueOrAlias}7A)`,
              "8A": `var(--${prefix}-P3-${hueOrAlias}8A)`,
              "9A": `var(--${prefix}-P3-${hueOrAlias}9A)`,
              "10A": `var(--${prefix}-P3-${hueOrAlias}10A)`,
              "11A": `var(--${prefix}-P3-${hueOrAlias}11A)`,
              "12A": `var(--${prefix}-P3-${hueOrAlias}12A)`,
            }
            : {
              ...(extend ? colorsOfSameHueInOriginalTheme : {}),

              "fg": `rgb(var(--${prefix}-${hueOrAlias}-fg) / <alpha-value>)`,

              "1": `rgb(var(--${prefix}-${hueOrAlias}1) / <alpha-value>)`,
              "2": `rgb(var(--${prefix}-${hueOrAlias}2) / <alpha-value>)`,
              "3": `rgb(var(--${prefix}-${hueOrAlias}3) / <alpha-value>)`,
              "4": `rgb(var(--${prefix}-${hueOrAlias}4) / <alpha-value>)`,
              "5": `rgb(var(--${prefix}-${hueOrAlias}5) / <alpha-value>)`,
              "6": `rgb(var(--${prefix}-${hueOrAlias}6) / <alpha-value>)`,
              "7": `rgb(var(--${prefix}-${hueOrAlias}7) / <alpha-value>)`,
              "8": `rgb(var(--${prefix}-${hueOrAlias}8) / <alpha-value>)`,
              "9": `rgb(var(--${prefix}-${hueOrAlias}9) / <alpha-value>)`,
              "10": `rgb(var(--${prefix}-${hueOrAlias}10) / <alpha-value>)`,
              "11": `rgb(var(--${prefix}-${hueOrAlias}11) / <alpha-value>)`,
              "12": `rgb(var(--${prefix}-${hueOrAlias}12) / <alpha-value>)`,

              // put colors with alpha values inside var(...) so, unocss don't add extra opacity and break it.
              "1A": `var(--${prefix}-${hueOrAlias}1A)`,
              "2A": `var(--${prefix}-${hueOrAlias}2A)`,
              "3A": `var(--${prefix}-${hueOrAlias}3A)`,
              "4A": `var(--${prefix}-${hueOrAlias}4A)`,
              "5A": `var(--${prefix}-${hueOrAlias}5A)`,
              "6A": `var(--${prefix}-${hueOrAlias}6A)`,
              "7A": `var(--${prefix}-${hueOrAlias}7A)`,
              "8A": `var(--${prefix}-${hueOrAlias}8A)`,
              "9A": `var(--${prefix}-${hueOrAlias}9A)`,
              "10A": `var(--${prefix}-${hueOrAlias}10A)`,
              "11A": `var(--${prefix}-${hueOrAlias}11A)`,
              "12A": `var(--${prefix}-${hueOrAlias}12A)`,
            },
        ];
      })
    ),
    white: {
      // if user has defind some variation for white (white-400 or white-warm)
      ...(extend && typeof theme?.colors?.["white"] !== "string" ? theme?.colors?.["white"] : {}),
      DEFAULT: "#ffffff",

      fg: 'black',

      "1A": `var(--${prefix}-white1A)`,
      "2A": `var(--${prefix}-white2A)`,
      "3A": `var(--${prefix}-white3A)`,
      "4A": `var(--${prefix}-white4A)`,
      "5A": `var(--${prefix}-white5A)`,
      "6A": `var(--${prefix}-white6A)`,
      "7A": `var(--${prefix}-white7A)`,
      "8A": `var(--${prefix}-white8A)`,
      "9A": `var(--${prefix}-white9A)`,
      "10A": `var(--${prefix}-white10A)`,
      "11A": `var(--${prefix}-white11A)`,
      "12A": `var(--${prefix}-white12A)`,
    },
    black: {
      ...(extend && typeof theme?.colors?.["white"] !== "string" ? theme?.colors?.["white"] : {}),
      DEFAULT: "#000000",

      fg: 'white',

      "1A": `var(--${prefix}-black1A)`,
      "2A": `var(--${prefix}-black2A)`,
      "3A": `var(--${prefix}-black3A)`,
      "4A": `var(--${prefix}-black4A)`,
      "5A": `var(--${prefix}-black5A)`,
      "6A": `var(--${prefix}-black6A)`,
      "7A": `var(--${prefix}-black7A)`,
      "8A": `var(--${prefix}-black8A)`,
      "9A": `var(--${prefix}-black9A)`,
      "10A": `var(--${prefix}-black10A)`,
      "11A": `var(--${prefix}-black11A)`,
      "12A": `var(--${prefix}-black12A)`,
    },
  } as Theme["colors"];
}

