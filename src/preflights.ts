import { AliasesInUse, Alpha, ColorsInUse, Dark, Options, P3, RadixHue, RadixHueOrBlackOrWhite, Shade, ShadeAlpha } from './types';
import Color from "colorjs.io";
import * as radixColors from "@radix-ui/colors";


export function generateCSSVariablesForColorsInUse({
  colorsInUse,
  aliasesInUse,
  darkSelector,
  lightSelector,
  prefix,
  useP3Colors,
  onlyOneTheme,
  safelistAliases = [],
  aliases = {},
}: {
  aliasesInUse: AliasesInUse;
  colorsInUse: ColorsInUse;
} & Omit<Options, "extend" | "safelistColors">): string {
  const globalCSSRules: string[] = [];
  const globalP3CSSRules: string[] = [];
  const lightThemeCSSRules: string[] = [];
  const lightThemeP3CSSRules: string[] = [];
  const darkThemeCSSRules: string[] = [];
  const darkThemeP3CSSRules: string[] = [];

  for (const _hue of Object.keys(colorsInUse)) {
    for (const shadeAlpha of Object.keys(colorsInUse[_hue as RadixHueOrBlackOrWhite].shadesInUse)) {
      const { hue, shade, alpha } = colorsInUse[_hue as RadixHueOrBlackOrWhite].shadesInUse[shadeAlpha as ShadeAlpha];

      if (["black", "white"].includes(hue)) {
        globalCSSRules.push(
          `--${prefix}-${hue}${shade}${alpha}: ${getColorValue({ hue, shade, alpha, dark: "", p3: "" })};`
        );
        if (useP3Colors) {
          globalP3CSSRules.push(
            `--${prefix}-P3-${hue}${shade}${alpha}: ${getColorValue({ hue, shade, alpha, dark: "", p3: "P3" })};`
          );
        }

      } else {
        lightThemeCSSRules.push(
          `--${prefix}-${hue}${shade}${alpha}: ${getColorValue({ hue, shade, alpha, dark: "", p3: "" })};`
        );
        darkThemeCSSRules.push(
          `--${prefix}-${hue}${shade}${alpha}: ${getColorValue({ hue, shade, alpha, dark: "Dark", p3: "" })};`
        );
        if (useP3Colors) {
          lightThemeP3CSSRules.push(
            `--${prefix}-P3-${hue}${shade}${alpha}: ${getColorValue({ hue, shade, alpha, dark: "", p3: "P3" })};`
          );
          darkThemeP3CSSRules.push(
            `--${prefix}-P3-${hue}${shade}${alpha}: ${getColorValue({
              hue,
              shade,
              alpha,
              dark: "Dark",
              p3: "P3",
            })};`
          );
        }
      }
    }
  }



  // define aliases that are set in preset options

  // for safelistedOnes, create all shades
  for (const alias of safelistAliases) {
    if (!Object.keys(aliases).includes(alias)) continue;
    const hue = aliases[alias];
    for (let i = 1; i <= 12; i++) {
      globalCSSRules.push(`--${prefix}-${alias}${i}: var(--${prefix}-${hue}${i});`);
      globalCSSRules.push(`--${prefix}-${alias}${i}A: var(--${prefix}-${hue}${i}A);`);
      if (useP3Colors) {
        globalCSSRules.push(`--${prefix}-P3-${alias}${i}: var(--${prefix}-P3-${hue}${i});`);
        globalCSSRules.push(`--${prefix}-P3-${alias}${i}A: var(--${prefix}-P3-${hue}${i}A);`);
      }
    }
  }

  // for those that are not safelisted, only create the shadeAlphas that are used in the porject.
  for (const alias of Object.keys(aliases)) {
    // skip aliases that were in safelistAliases
    if (safelistAliases.includes(alias)) continue;
    const hue = aliases[alias];
    for (const shadeAlpha of Object.keys(aliasesInUse[alias].shadesInUse)) {
      globalCSSRules.push(`--${prefix}-${alias}${shadeAlpha}: var(--${prefix}-${hue}${shadeAlpha});`);
      if (useP3Colors) {
        globalCSSRules.push(`--${prefix}-P3-${alias}${shadeAlpha}: var(--${prefix}-P3-${hue}${shadeAlpha});`);
      }
    }
  }

  // console.log("🚀 ~ globalCSSRules:", globalCSSRules)
  let css = `
  :root {
    ${globalCSSRules.join("\n")}
    ${onlyOneTheme === "light" ? lightThemeCSSRules.join("\n") : ""}
    ${onlyOneTheme === "dark" ? darkThemeCSSRules.join("\n") : ""}
  }`;

  if (useP3Colors) {
    css = `${css}
    @supports(color: color(display-p3 0 0 1)) {
      :root {
        ${globalP3CSSRules.join("\n")}
        ${onlyOneTheme === "light" ? lightThemeP3CSSRules.join("\n") : ""}
        ${onlyOneTheme === "dark" ? darkThemeP3CSSRules.join("\n") : ""}
      }
    }`;
  }

  if (onlyOneTheme) return css;

  //  if both light and dark theme exist
  css = `${css}
${lightSelector} {
  ${lightThemeCSSRules.join("\n")}
}
${darkSelector} {
  ${darkThemeCSSRules.join("\n")}
}
`;

  if (useP3Colors) {
    css = `${css}
@supports(color: color(display-p3 0 0 1)) {
  ${lightSelector} {
    ${lightThemeP3CSSRules.join("\n")}
  }
  ${darkSelector} {
    ${darkThemeP3CSSRules.join("\n")}
  }
}`;
  }

  return css;
}



function getColorValue({
  hue,
  dark = "",
  shade,
  alpha = "",
  p3 = "",
}: {
  alpha?: Alpha;
  hue: RadixHue | "black" | "white";
  dark?: Dark;
  shade: Shade;
  p3?: P3;
}) {
  let value = "";
  //@ts-ignore
  value = radixColors[`${hue}${dark}${p3}${alpha}`][`${hue}${alpha}${shade}`];

  if (p3 === "P3") {
    if (alpha === "A") {
      return value;
    }
    if (alpha === "") {
      // return in p3 format ex: '1 4 5'
      // so we can use tailwind opacity (bg-opacity-30 or bg-blue9/30) with it
      return value.replace("color(display-p3", "").replace(")", "").trim();
    }
  }

  if (p3 === "") {
    // convert Hex values to rgb values
    const color = new Color(value);
    value = color.toString({ format: "rgb" });
    if (alpha === "A") {
      return value; // put it inside var() so unocss can not add opacity to it.
    }
    if (alpha === "") {
      // convert 'rgba(100 , 40, 50)' to '100 40 50' to be used in rgba(  / <alpha-value>)
      // so we can use tailwind opacity (bg-opacity-30 or bg-blue9/30) with it
      return value.replace("rgb(", "").replace(")", "").trim();
    }
  }
}
