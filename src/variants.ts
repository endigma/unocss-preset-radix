import { VariantContext, CSSEntries } from 'unocss';
import type { Theme } from 'unocss/preset-uno';

export function addP3Fallbacks({ prefix }: { prefix: string }) {
  return {
    name: 'with P3 fallbacks',
    match: (matcher: string, context: Readonly<VariantContext<Theme>>) => {
      if (!matcher.includes('with-P3-fallbacks:')) return matcher;
      return {
        matcher: matcher.replaceAll('with-P3-fallbacks:', ''),
        body: (cssEntries: CSSEntries) => {
          let cssEntriesWithP3Fallbacks = cssEntries;
          for (const entry of cssEntries) {
            const property: string = entry[0];
            let value = entry[1] ?? '';
            if (typeof value === 'number') continue;
            // non alpha colors
            if (value.includes(`color(display-p3 var(--${prefix}-P3-`)) {
              const fallBackValue = value.replaceAll(`color(display-p3 var(--${prefix}-P3-`, `rgb(var(--${prefix}-`);
              cssEntriesWithP3Fallbacks = [[property, fallBackValue], ...cssEntriesWithP3Fallbacks];
              // for alpha colors
            } else if (value.includes(`var(--${prefix}-P3-`)) {
              const fallBackValue = value.replaceAll(`var(--${prefix}-P3-`, `var(--${prefix}-`);
              cssEntriesWithP3Fallbacks = [[property, fallBackValue], ...cssEntriesWithP3Fallbacks];
            }
          }
          return cssEntriesWithP3Fallbacks;
        },
      };
    },
  };
}
