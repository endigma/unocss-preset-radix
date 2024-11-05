import { Alpha, Dark, P3, RadixHue, Step, StepAlpha } from "./types";
import * as radixColors from "@radix-ui/colors";
import * as colorsInUseHelpers from "./colorsInUseHelpers";
import * as aliasesInUseHelpers from "./aliasesInUseHelpers";
import { fg } from "./fg";

type Props = {
  darkSelector: string;
  lightSelector: string;
  prefix: string;
  useP3Colors: boolean;
  onlyOneTheme?: string | null;
  aliases: Record<string, RadixHue>;
};

export function generateCSSVariablesForColorsInUse({
  darkSelector,
  lightSelector,
  prefix,
  useP3Colors,
  onlyOneTheme = null,
  aliases = {},
}: Props): string {
  const aliasesInUse = aliasesInUseHelpers.getAliasesInUse();

  // for all alias-step-alpha used, add corresponding colors (or possible colors) to colorsInuse
  for (const alias in aliasesInUse) {
    for (const possibleHue of aliasesInUse[alias].possibleHues) {
      for (const stepAlpha in aliasesInUse[alias].stepsInUse) {
        const { alpha, step } = aliasesInUse[alias].stepsInUse[stepAlpha as StepAlpha];
        colorsInUseHelpers.addColor({ hue: possibleHue, step, alpha });
      }
    }
  }

  const cssRules: Record<string, string[]> = {
    global: [],
    globalP3: [],
    lightTheme: [],
    lightThemeP3: [],
    darkTheme: [],
    darkThemeP3: [],
  };

  const colorsInUse = colorsInUseHelpers.getColorsInUse();

  for (const _hue in colorsInUse) {
    for (const stepAlpha in colorsInUse[_hue as RadixHue | "black" | "white"].stepsInUse) {
      const { hue, step, alpha } = colorsInUse[_hue as RadixHue | "black" | "white"].stepsInUse[stepAlpha as StepAlpha];

      if (["black", "white"].includes(hue) || step === "-fg") {
        cssRules.global.push(
          `--${prefix}-${hue}${step}${alpha}: ${getColorValue({ hue, step, alpha, dark: "", p3: "" })};`
        );
        if (useP3Colors) {
          cssRules.globalP3.push(
            `--${prefix}-${hue}${step}${alpha}: ${getColorValue({ hue, step, alpha, dark: "", p3: "P3" })};`
          );
        }
      } else {
        cssRules.lightTheme.push(
          `--${prefix}-${hue}${step}${alpha}: ${getColorValue({ hue, step, alpha, dark: "", p3: "" })};`
        );
        cssRules.darkTheme.push(
          `--${prefix}-${hue}${step}${alpha}: ${getColorValue({ hue, step, alpha, dark: "Dark", p3: "" })};`
        );
        if (useP3Colors) {
          cssRules.lightThemeP3.push(
            `--${prefix}-${hue}${step}${alpha}: ${getColorValue({ hue, step, alpha, dark: "", p3: "P3" })};`
          );
          cssRules.darkThemeP3.push(
            `--${prefix}-${hue}${step}${alpha}: ${getColorValue({
              hue,
              step,
              alpha,
              dark: "Dark",
              p3: "P3",
            })};`
          );
        }
      }
    }
  }

  for (const alias in aliasesInUse) {
    const hue = aliases[alias];
    // for hues that are not defined in the aliases (defined via dynamic aliasing), skip.
    if (!hue) continue;
    for (const stepAlpha in aliasesInUse[alias].stepsInUse) {
      cssRules.global.push(`--${prefix}-${alias}${stepAlpha}: var(--${prefix}-${hue}${stepAlpha});`);
    }
  }

  const scopeRules = {} as Record<string, string[]>;

  for (const alias in aliasesInUse) {
    const scopes = aliasesInUse[alias].scopes;

    for (const selector in scopes) {
      const hue = scopes[selector];
      for (const stepAlpha in aliasesInUse[alias].stepsInUse) {
        scopeRules[selector] ??= [];
        scopeRules[selector].push(`--${prefix}-${alias}${stepAlpha}: var(--${prefix}-${hue}${stepAlpha});`);
      }
    }
  }

  const scopeCss = Object.keys(scopeRules)
    .map((selector) => {
      return `${selector} {
${scopeRules[selector].join("")}
}`;
    })
    .join("");

  let css = `:root {${[
    cssRules.global.join(""),
    onlyOneTheme === "light" ? cssRules.lightTheme.join("") : undefined,
    onlyOneTheme === "dark" ? cssRules.darkTheme.join("") : undefined,
  ].join("")}}`;

  if (useP3Colors) {
    css = `${css}
@supports(color: color(display-p3 0 0 1)){:root{${[
      cssRules.globalP3.join(""),
      onlyOneTheme === "light" ? cssRules.lightThemeP3.join("") : undefined,
      onlyOneTheme === "dark" ? cssRules.darkThemeP3.join("") : undefined,
    ].join("")}}}`;
  }

  css = `${css}
${scopeCss}`;

  //  if both light and dark theme exist
  if (!onlyOneTheme) {
    css = `${css}
${lightSelector} {${cssRules.lightTheme.join("")}}
${darkSelector} {${cssRules.darkTheme.join("")}}`;

    if (useP3Colors) {
      css = `${css}
@supports(color: color(display-p3 0 0 1)){${lightSelector} {${cssRules.lightThemeP3.join(
        ""
      )}} ${darkSelector} {${cssRules.darkThemeP3.join("")}}}`;
    }
  }

  return css.replaceAll("\n\n", "\n").replaceAll("\n \n", "");
}

function getColorValue({
  hue,
  dark = "",
  step,
  alpha = "",
  p3 = "",
}: {
  alpha?: Alpha;
  hue: RadixHue | "black" | "white";
  dark?: Dark;
  step: Step;
  p3?: P3;
}) {
  if (step === "-fg") return fg(hue);

  let value = "";
  //@ts-ignore
  value = radixColors[`${hue}${dark}${p3}${alpha}`][`${hue}${alpha}${step}`];

  if (p3 === "P3") {
    if (alpha === "A") return value;
    if (alpha === "") {
      // return in p3 format ex: '1 4 5'
      // so we can use tailwind opacity (bg-opacity-30 or bg-blue9/30) with it
      // return value.replace('color(display-p3', '').replace(')', '').trim();
      return value;
    }
  }

  if (p3 === "") {
    // convert Hex or rgb values to rgb values
    // const color = new Color(value);

    if (alpha === "A") {
      // value = color.toString({ format: 'rgb', precision: 4 });
      return value; // put it inside var() so unocss can not add opacity to it.
    }
    if (alpha === "") {
      // convert 'rgb(100 40 50)' to '100 40 50' to be used in rgb(  / <alpha-value>)
      // so we can use tailwind opacity (bg-opacity-30 or bg-blue9/30) with it
      // value = color.toString({ format: 'rgba', precision: 4 });
      // return value.replace('rgba(', '').replace(')', '').trim();
      return value;
    }
  }
}
