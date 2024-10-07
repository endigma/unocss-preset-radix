import { createGenerator } from '@unocss/core';
import { describe, expect, it } from 'vitest';
import { presetRadix } from '../src';
import { presetUno } from 'unocss';
import cssToObject from 'transform-css-to-js';

const prefix = 'rx';

const lightSelector = `:root .light-theme`;
const darkSelector = `.dark-theme`;

const template = ({ root, dark, light, defaultLayer }) => {
  return `
      "/* layer: radix-colors */
      :root {
        ${root}
      }
      :root, .light-theme {
        ${light}
      }
      .dark-theme {
        ${dark}
      }
      /* layer: default */
      ${defaultLayer}"`;
};

describe('preset-radix', () => {
  const uno = createGenerator({
    presets: [
      presetUno({ dark: 'class', preflight: false }),
      presetRadix({
        prefix,
        lightSelector,
        darkSelector,
      }),
    ],
  });
  const tt = async () => {
    const rawCss = (await uno.generate(new Set(['bg-red5']))).css;
    const css = cssToObject(rawCss);

    // const propretyCreated = 'backgroundColor' in css['bg-red5'];
    // const lightColorCreated = `--${prefix}-red5` in css[lightSelector];
    // const darkColorCreated = `--${prefix}-red5` in css[darkSelector];

    // return propretyCreated && lightColorCreated && darkColorCreated;
    return true;
  };
  it('should create proprety', async () => {
    expect((await uno.generate(new Set(['bg-red5']))).css).toSatisfy((css: string) => {
      return css.includes(`background-color:`);
    });
  });
  
  it('should add css variable', async () => {
    expect((await uno.generate(new Set(['bg-red5']))).css).toSatisfy((css: string) => {
      return css.includes(`--${prefix}-red5:`);
    });
  });
});
