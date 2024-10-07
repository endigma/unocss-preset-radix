import { Aliases, Alpha, Dark, Options, P3, RadixHue, RadixHueOrBlackOrWhite, Shade, ShadeAlpha } from './types';
import Color from 'colorjs.io';
import * as radixColors from '@radix-ui/colors';
import * as colorsInUseHelpers from './colorsInUseHelpers';

export function generateCSSVariablesForColorsInUse<T extends Aliases>({
  darkSelector,
  lightSelector,
  prefix,
  useP3Colors,
  onlyOneTheme,
  safelistAliases: _safelistAliases,
  aliases: _aliases,
}: Omit<Options<T>, 'extend' | 'safelistColors'>): string {
  const aliases = (_aliases ?? {}) as Record<string, RadixHue>;
  const safelistAliases = (_safelistAliases ?? []) as string[];
  const globalCSSRules: string[] = [];
  const globalP3CSSRules: string[] = [];
  const lightThemeCSSRules: string[] = [];
  const lightThemeP3CSSRules: string[] = [];
  const darkThemeCSSRules: string[] = [];
  const darkThemeP3CSSRules: string[] = [];

  const colorsInUse = colorsInUseHelpers.getColorsInUse();
  const aliasesInUse = colorsInUseHelpers.getAliasesInUse();

  // const colorsInUse = colors
  for (const _hue in colorsInUse) {
    for (const shadeAlpha in colorsInUse[_hue as RadixHueOrBlackOrWhite].shadesInUse) {
      const { hue, shade, alpha } = colorsInUse[_hue as RadixHueOrBlackOrWhite].shadesInUse[shadeAlpha as ShadeAlpha];

      if (['black', 'white'].includes(hue)) {
        globalCSSRules.push(
          `--${prefix}-${hue}${shade}${alpha}: ${getColorValue({ hue, shade, alpha, dark: '', p3: '' })};`
        );
        if (useP3Colors) {
          globalP3CSSRules.push(
            `--${prefix}-P3-${hue}${shade}${alpha}: ${getColorValue({ hue, shade, alpha, dark: '', p3: 'P3' })};`
          );
        }
      } else {
        lightThemeCSSRules.push(
          `--${prefix}-${hue}${shade}${alpha}: ${getColorValue({ hue, shade, alpha, dark: '', p3: '' })};`
        );
        darkThemeCSSRules.push(
          `--${prefix}-${hue}${shade}${alpha}: ${getColorValue({ hue, shade, alpha, dark: 'Dark', p3: '' })};`
        );
        if (useP3Colors) {
          lightThemeP3CSSRules.push(
            `--${prefix}-P3-${hue}${shade}${alpha}: ${getColorValue({ hue, shade, alpha, dark: '', p3: 'P3' })};`
          );
          darkThemeP3CSSRules.push(
            `--${prefix}-P3-${hue}${shade}${alpha}: ${getColorValue({
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

  // define aliases that are set in preset options

  // for safelistedOnes, create all shades
  for (const alias of safelistAliases) {
    if (!(alias in aliases)) continue;
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
  for (const alias in aliases) {
    // skip aliases that were in safelistAliases
    if (safelistAliases.includes(alias)) continue;
    const hue = aliases[alias];
    for (const shadeAlpha in aliasesInUse[alias].shadesInUse) {
      globalCSSRules.push(`--${prefix}-${alias}${shadeAlpha}: var(--${prefix}-${hue}${shadeAlpha});`);
      if (useP3Colors) {
        globalCSSRules.push(`--${prefix}-P3-${alias}${shadeAlpha}: var(--${prefix}-P3-${hue}${shadeAlpha});`);
      }
    }
  }

  let css = `:root {
    ${[
      globalCSSRules.join('\n'),
      onlyOneTheme === 'light' ? lightThemeCSSRules.join('\n') : '',
      onlyOneTheme === 'dark' ? darkThemeCSSRules.join('\n') : '',
    ].join('\n')}
  }`;

  if (useP3Colors) {
    css = `${css}
    @supports(color: color(display-p3 0 0 1)) {
      :root {
        ${[
        globalP3CSSRules.join('\n'),
        onlyOneTheme === 'light' ? lightThemeP3CSSRules.join('\n') : '',
        onlyOneTheme === 'dark' ? darkThemeP3CSSRules.join('\n') : '',
      ].join('\n')}
    }`;
  }

  if (onlyOneTheme) return css;

  //  if both light and dark theme exist
  css = `${css}
${lightSelector} {
  ${lightThemeCSSRules.join('\n')}
}
${darkSelector} {
  ${darkThemeCSSRules.join('\n')}
}`;

  if (useP3Colors) {
    css = `${css}
@supports(color: color(display-p3 0 0 1)) {
  ${lightSelector} {
    ${lightThemeP3CSSRules.join('\n')}
  }
  ${darkSelector} {
    ${darkThemeP3CSSRules.join('\n')}
  }
}`;
  }

  return css.replaceAll('\n\n', '\n').replaceAll('  ', ' ').replaceAll('\n \n', '');
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
  let value = '';
  //@ts-ignore
  value = radixColors[`${hue}${dark}${p3}${alpha}`][`${hue}${alpha}${shade}`];

  if (p3 === 'P3') {
    if (alpha === 'A') {
      return value;
    }
    if (alpha === '') {
      // return in p3 format ex: '1 4 5'
      // so we can use tailwind opacity (bg-opacity-30 or bg-blue9/30) with it
      return value.replace('color(display-p3', '').replace(')', '').trim();
    }
  }

  if (p3 === '') {
    // convert Hex values to rgb values
    const color = new Color(value);

    if (alpha === 'A') {
      value = color.toString({ format: 'rgb', precision: 4 });
      return value; // put it inside var() so unocss can not add opacity to it.
    }
    if (alpha === '') {
      // convert 'rgb(100 40 50)' to '100 40 50' to be used in rgb(  / <alpha-value>)
      // so we can use tailwind opacity (bg-opacity-30 or bg-blue9/30) with it
      value = color.toString({ format: 'rgba', precision: 4 });
      return value.replace('rgba(', '').replace(')', '').trim();
    }
  }
}
