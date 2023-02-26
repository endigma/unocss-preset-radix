import * as radix from "@radix-ui/colors";

export type RadixScales = Exclude<keyof typeof radix, "__esModule" | "default">;
export type RadixColors = Exclude<
  RadixScales,
  `${RadixScales}Dark` | `${RadixScales}DarkA` | `${RadixScales}A` | "whiteA" | "blackA"
>;

type StepIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type Scale = {
  readonly [key in StepIndex]: string;
};

type Palette = [string, Color][];

type Color = {
  light: Scale;
  lightAlpha: Scale;
  dark: Scale;
  darkAlpha: Scale;
};

function getScale(name: string): Scale {
  const rawScale = radix[name as RadixScales] as { [key: string]: string };

  const keyValues = Object.keys(rawScale).map((key) => {
    return { [parseInt(key.match(/.*?(\d+)/)![1])]: rawScale[key] };
  });
  return Object.assign({}, ...keyValues);
}

export function getColor(name: RadixColors): Color {
  return {
    light: getScale(name),
    lightAlpha: getScale(name + "A"),
    dark: getScale(name + "Dark"),
    darkAlpha: getScale(name + "DarkA"),
  };
}

export function getColors(...names: RadixColors[]): Palette {
  return names.map((n) => [n, getColor(n)]);
}

export function genCSS(palette: Palette, darkSelector = ".dark-theme"): string {
  const css: string[] = [];

  css.push(":root {");
  for (const [label, color] of palette) {
    for (const [shade, value] of Object.entries(color.light)) {
      css.push(`--${label}${shade}:${value};`);
    }
    for (const [shade, value] of Object.entries(color.lightAlpha)) {
      css.push(`--${label}${shade}A:${value};`);
    }
  }
  css.push("}");

  css.push(`${darkSelector} {`);
  for (const [label, color] of palette) {
    for (const [shade, value] of Object.entries(color.dark)) {
      css.push(`--${label}${shade}:${value};`);
    }
    for (const [shade, value] of Object.entries(color.darkAlpha)) {
      css.push(`--${label}${shade}:${value};`);
    }
  }
  css.push("}");

  return css.join("\n");
}
