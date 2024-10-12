import { Alpha, Dark, P3, RadixHue, Shade, ShadeAlpha } from './types';
import Color from 'colorjs.io';
import * as radixColors from '@radix-ui/colors';
import * as colorsInUseHelpers from './colorsInUseHelpers';
import * as aliasesInUseHelpers from './aliasesInUseHelpers';
import { fg } from './fg';

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

  // for all aliase-shade-alpha used, add corresponding colors (or possible colors) to colorsInuse
  for (const alias in aliasesInUse) {
    for (const possibleHue of aliasesInUse[alias].possibleHues) {
      for (const shadeAlpha in aliasesInUse[alias].shadesInUse) {
        const { alpha, shade } = aliasesInUse[alias].shadesInUse[shadeAlpha as ShadeAlpha];
        colorsInUseHelpers.addColor({ hue: possibleHue, shade, alpha });
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
    for (const shadeAlpha in colorsInUse[_hue as RadixHue | 'black' | 'white'].shadesInUse) {
      const { hue, shade, alpha } =
        colorsInUse[_hue as RadixHue | 'black' | 'white'].shadesInUse[shadeAlpha as ShadeAlpha];

      if (['black', 'white'].includes(hue) || shade === '-fg') {
        cssRules.global.push(
          `--${prefix}-${hue}${shade}${alpha}: ${getColorValue({ hue, shade, alpha, dark: '', p3: '' })};`
        );
        if (useP3Colors) {
          cssRules.globalP3.push(
            `--${prefix}-${hue}${shade}${alpha}: ${getColorValue({ hue, shade, alpha, dark: '', p3: 'P3' })};`
          );
        }
      } else {
        cssRules.lightTheme.push(
          `--${prefix}-${hue}${shade}${alpha}: ${getColorValue({ hue, shade, alpha, dark: '', p3: '' })};`
        );
        cssRules.darkTheme.push(
          `--${prefix}-${hue}${shade}${alpha}: ${getColorValue({ hue, shade, alpha, dark: 'Dark', p3: '' })};`
        );
        if (useP3Colors) {
          cssRules.lightThemeP3.push(
            `--${prefix}-${hue}${shade}${alpha}: ${getColorValue({ hue, shade, alpha, dark: '', p3: 'P3' })};`
          );
          cssRules.darkThemeP3.push(
            `--${prefix}-${hue}${shade}${alpha}: ${getColorValue({
              hue,
              shade,
              alpha,
              dark: 'Dark',
              p3: 'P3',
            })};`
          );
        }
      }
    }
  }

  for (const alias in aliasesInUse) {
    const hue = aliases[alias];
    // for hues that are not defined in the aliases (defiend via dynamic aliasing), skip.
    if (!hue) continue;
    for (const shadeAlpha in aliasesInUse[alias].shadesInUse) {
      cssRules.global.push(`--${prefix}-${alias}${shadeAlpha}: var(--${prefix}-${hue}${shadeAlpha});`);
    }
  }

  const scopeRules = {} as Record<string, string[]>;


  for (const alias in aliasesInUse) {
    const scopes = aliasesInUse[alias].scopes;

    for (const selector in scopes) {
      const hue = scopes[selector];
      for (const shadeAlpha in aliasesInUse[alias].shadesInUse) {
        scopeRules[selector] ??= [];
        scopeRules[selector].push(`--${prefix}-${alias}${shadeAlpha}: var(--${prefix}-${hue}${shadeAlpha});`);
      }
    }
  }

  const scopeCss = Object.keys(scopeRules)
    .map((selector) => {
      return `${selector} {
${scopeRules[selector].join('\n  ')}
}`;
    })
    .join('\n');

  let css = `:root {
  ${[
      cssRules.global.join('\n  '),
      onlyOneTheme === 'light' ? cssRules.lightTheme.join('\n  ') : undefined,
      onlyOneTheme === 'dark' ? cssRules.darkTheme.join('\n  ') : undefined,
    ].join('\n  ')}
}`;

  if (useP3Colors) {
    css = `${css}
@supports(color: color(display-p3 0 0 1)) {
  :root {
    ${[
        cssRules.globalP3.join('\n    '),
        onlyOneTheme === 'light' ? cssRules.lightThemeP3.join('\n    ') : undefined,
        onlyOneTheme === 'dark' ? cssRules.darkThemeP3.join('\n    ') : undefined,
      ].join('\n    ')}
  }
}`;
  }

  css = `${css}
${scopeCss}`;

  //  if both light and dark theme exist
  if (!onlyOneTheme) {
    css = `${css}
${lightSelector} {
  ${cssRules.lightTheme.join('\n  ')}
}
${darkSelector} {
  ${cssRules.darkTheme.join('\n  ')}
}`;

    if (useP3Colors) {
      css = `${css}
@supports(color: color(display-p3 0 0 1)) {
  ${lightSelector} {
    ${cssRules.lightThemeP3.join('\n    ')}
  }
  ${darkSelector} {
    ${cssRules.darkThemeP3.join('\n    ')}
  }
}`;
    }
  }

  return css.replaceAll('\n\n', '\n').replaceAll('\n \n', '');
}

function getColorValue({
  hue,
  dark = '',
  shade,
  alpha = '',
  p3 = '',
}: {
  alpha?: Alpha;
  hue: RadixHue | 'black' | 'white';
  dark?: Dark;
  shade: Shade;
  p3?: P3;
}) {
  if (shade === '-fg') return fg(hue);

  let value = '';
  //@ts-ignore
  value = radixColors[`${hue}${dark}${p3}${alpha}`][`${hue}${alpha}${shade}`];

  if (p3 === 'P3') {
    if (alpha === 'A') return value;
    if (alpha === '') {
      // return in p3 format ex: '1 4 5'
      // so we can use tailwind opacity (bg-opacity-30 or bg-blue9/30) with it
      // return value.replace('color(display-p3', '').replace(')', '').trim();
      return value;
    }
  }

  if (p3 === '') {
    // convert Hex or rgb values to rgb values
    // const color = new Color(value);

    if (alpha === 'A') {
      // value = color.toString({ format: 'rgb', precision: 4 });
      return value; // put it inside var() so unocss can not add opacity to it.
    }
    if (alpha === '') {
      // convert 'rgb(100 40 50)' to '100 40 50' to be used in rgb(  / <alpha-value>)
      // so we can use tailwind opacity (bg-opacity-30 or bg-blue9/30) with it
      // value = color.toString({ format: 'rgba', precision: 4 });
      // return value.replace('rgba(', '').replace(')', '').trim();
      return value;
    }
  }
}
