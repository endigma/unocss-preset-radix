import * as radix from "@radix-ui/colors";
import type { RadixScales, RadixColors, RadixSteps, RadixSolidSteps, RadixAlphaSteps } from "./radix";

type Scale = {
  readonly [key in RadixSteps]: string;
};

type SolidScale = {
  readonly [key in RadixSolidSteps]: string;
}

type AlphaScale = {
  readonly [key in RadixAlphaSteps]: string;
}

type Palette = [string, Color][];

type Color = {
  light: SolidScale;
  lightAlpha: AlphaScale;
  dark: SolidScale;
  darkAlpha: AlphaScale;
};

function getSolidScale(name: keyof typeof radix): SolidScale {
  const rawScale = radix[name as RadixScales] as Record<string, string>;

  const keyValues = Object.keys(rawScale).map((key) => {
    const parsedKey = key.match(/.*?(\d+)/)![1];
    return [parseInt(parsedKey), rawScale[key]];
  });

  return Object.fromEntries(keyValues);
}

function getAlphaScale(name: keyof typeof radix): AlphaScale {
  const rawScale = radix[name as RadixScales] as Record<string, string>;

  const keyValues = Object.keys(rawScale).map((key) => {
    const parsedKey = key.match(/.*?(\d+)/)![1];
    return [parseInt(parsedKey), rawScale[key]];
  });

  return Object.fromEntries(keyValues);
}

const pureScales: Record<"white" | "black", SolidScale> = {
  white: {
    1: "#fff",
    2: "#fff",
    3: "#fff",
    4: "#fff",
    5: "#fff",
    6: "#fff",
    7: "#fff",
    8: "#fff",
    9: "#fff",
    10: "#fff",
    11: "#fff",
    12: "#fff",
  },
  black: {
    1: "#000",
    2: "#000",
    3: "#000",
    4: "#000",
    5: "#000",
    6: "#000",
    7: "#000",
    8: "#000",
    9: "#000",
    10: "#000",
    11: "#000",
    12: "#000",
  }
} as const

export function getColor(name: RadixColors): Color {
  if (name === "black" || name === "white") {
    return {
      light: pureScales[name],
      lightAlpha: getAlphaScale(`${name}A`),
      dark: pureScales[name],
      darkAlpha: getAlphaScale(`${name}A`),
    };
  }

  return {
    light: getSolidScale(name),
    lightAlpha: getAlphaScale(`${name}A`),
    dark: getSolidScale(`${name}Dark`),
    darkAlpha: getAlphaScale(`${name}DarkA`),
  };
}

function fg(color: string) {
  if (["sky", "mint", "lime", "yellow", "amber", "white"].includes(color)) {
    return "black";
  }
  return "white";
}

export function generateColors(palette: Palette, prefix: string) {
  const colors: Record<string, Record<number, string>> = {};

  function generateColor(_name: string, isAlpha: boolean) {
    const shades: Record<string, string> = {};
    const name = isAlpha ? `${_name}A` : _name;

    for (let shade = 1; shade <= 12; shade++) {
      shades[shade] = `var(${prefix}${name}${shade})`;
      shades[`${shade}A`] = `var(${prefix}${name}${shade}A)`;
    }

    if (!isAlpha) {
      shades["fg"] = `var(${prefix}${name}-fg)`;
    }

    colors[name] = shades;
  }

  palette.forEach(([name]) => {
    generateColor(name, false);
    generateColor(name, true);
  });

  generateColor("black", true);
  generateColor("white", true);

  return colors;
}

export function generateHues(prefix: string) {
  function createHue(postfix: string = ""): Record<number, string> {
    const hue: Record<string, string> = {};

    for (let shade = 1; shade <= 12; shade++) {
      hue[shade] = `var(${prefix}hue${postfix}${shade})`;
      hue[`${shade}A`] = `var(${prefix}hue${postfix}${shade}A)`;
    }

    if (postfix === "") {
      hue["fg"] = `var(${prefix}hue-fg)`;
    }

    return hue;
  }

  return { hue: createHue(), hueA: createHue("A") };
}

export function newPalette(...names: RadixColors[]): Palette {
  return names.map((n) => [n, getColor(n)]);
}

export function genCSS(
  palette: Palette,
  darkSelector: string,
  lightSelector: string,
  prefix: string
): string {
  const css: string[] = [];

  function pushVar(
    label: string,
    [shade, value]: [string, string],
    isAlpha: boolean = false
  ) {
    css.push(`${prefix}${label}${shade}${isAlpha ? "A" : ""}:${value};`);
  }

  css.push(`${lightSelector} {`);
  for (const [label, color] of palette) {
    Object.entries(color.light).forEach((entry) => pushVar(label, entry));
    Object.entries(color.lightAlpha).forEach((entry) =>
      pushVar(label, entry, true)
    );
  }
  css.push("}\n");

  css.push(`${darkSelector} {`);
  for (const [label, color] of palette) {
    Object.entries(color.dark).forEach((entry) => pushVar(label, entry));
    Object.entries(color.darkAlpha).forEach((entry) =>
      pushVar(label, entry, true)
    );
  }
  css.push("}");

  css.push(":root {");
  for (const [label, color] of palette) {
    css.push(`${prefix}${label}-fg:${fg(label)};`);
  }
  Object.entries(getAlphaScale("blackA")).forEach((entry) =>
    pushVar("black", entry, true)
  );
  Object.entries(getAlphaScale("whiteA")).forEach((entry) =>
    pushVar("white", entry, true)
  );
  css.push("}");

  return css.join("");
}
