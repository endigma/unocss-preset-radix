import { Alpha, RadixHue, Step, StepAlpha } from "./types";

export type ColorProperties = {
  step: Step;
  alpha: Alpha;
  hue: RadixHue | "black" | "white";
};

export type ColorInUse = {
  stepsInUse: Record<StepAlpha, ColorProperties>;
};

export type ColorsInUse = Record<RadixHue | "black" | "white", ColorInUse>;

const colorsInUse = {} as ColorsInUse;

export function getColorsInUse() {
  return colorsInUse as Readonly<ColorsInUse>;
}

export function addColor({ hue, step, alpha }: { hue: RadixHue | "black" | "white"; step: Step; alpha: Alpha }) {
  colorsInUse[hue] = colorsInUse[hue] ?? {};
  colorsInUse[hue].stepsInUse = colorsInUse[hue].stepsInUse ?? {};
  colorsInUse[hue].stepsInUse[`${step}${alpha}` as StepAlpha] = { hue, step, alpha };
}
