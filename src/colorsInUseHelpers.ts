import {
  Alpha,
  RadixHue,
  Shade,
  ShadeAlpha,
} from './types';

export type ColorProperties = {
  shade: Shade;
  alpha: Alpha;
  hue: RadixHue | 'black' | 'white';
};


export type ColorInUse = {
  shadesInUse: Record<ShadeAlpha, ColorProperties>;
};

export type ColorsInUse = Record<RadixHue | 'black' | 'white', ColorInUse>;



const colorsInUse = {} as ColorsInUse;

export function getColorsInUse() {
  return colorsInUse as Readonly<ColorsInUse>;
}




export function addColor({ hue, shade, alpha }: { hue: RadixHue | 'black' | 'white'; shade: Shade; alpha: Alpha }) {
  colorsInUse[hue] = colorsInUse[hue] ?? {};
  colorsInUse[hue].shadesInUse = colorsInUse[hue].shadesInUse ?? {};
  colorsInUse[hue].shadesInUse[`${shade}${alpha}` as ShadeAlpha] = { hue, shade, alpha };
}
