import * as radix from "@radix-ui/colors";

export type RadixScales = Exclude<keyof typeof radix, "__esModule" | "default">;
export type RadixColors = Exclude<
  RadixScales,
  `${RadixScales}Dark` | `${RadixScales}DarkA`
>;

type StepIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type Scale = {
  readonly [key in StepIndex]: string;
};

type Palette = [string, Color][];

type Color = {
  light: Scale;
  dark: Scale | null;
};

function getScale(name: string): Scale {
  const rawScale = radix[name as RadixScales] as { [key: string]: string };

  const keyValues = Object.keys(rawScale).map((key) => {
    return [parseInt(key.match(/.*?(\d+)/)![1]), rawScale[key]];
  });

  return Object.fromEntries(keyValues);
}

export function getColor(name: RadixColors): Color {
  return {
    light: getScale(name),
    dark: ['whiteA', 'blackA'].includes(name) ? null : getScale(name.endsWith('A') ? name.slice(0, -1) + 'DarkA' : name + 'Dark')
  }
}

export function generateColors(palette: Palette, prefix: string) {
  let colors: { [key: string]: { [key: number]: string } } = {};

  palette.forEach(([name]) => {
    let shades: { [key: number]: string } = {};
    for (let shade = 1; shade <= 12; shade++) {
      shades[shade] = `var(${prefix}${name}${shade})`;
    }
    colors[name] = shades;
  });

  return colors;
}

export function generateHues(prefix: string) {
  const hue = Array.from({ length: 12 }, (_, i) => `var(${prefix}hue${i})`);
  return { hue };
}

export function newPalette(...names: RadixColors[]): Palette {
  return names.map((n) => [n, getColor(n)]);
}

export function genCSS(
  palette: Palette,
  darkSelector: string | boolean,
  lightSelector: string,
  prefix: string
): string {
  const css: string[] = [];

  css.push(`${lightSelector} {`);
  for (const [label, color] of palette) {
    for (const [shade, value] of Object.entries(color.light)) {
      css.push(`${prefix}${label}${shade}:${value};`);
    }
  }
  css.push("}\n");

  if (darkSelector) {
    css.push(`${darkSelector} {`);
    for (const [label, color] of palette) {
      // whiteA / blackA has not dark mode
      if (color.dark !== null) {
        for (const [shade, value] of Object.entries(color.dark)) {
          css.push(`${prefix}${label}${shade}:${value};`);
        }
      }
    }
    css.push("}");
  }

  return css.join("");
}
