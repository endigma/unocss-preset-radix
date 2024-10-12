import { Alpha, P3, Step } from './types';

export const RADIX_HUES = [
  "amber",
  "blue",
  "bronze",
  "brown",
  "crimson",
  "cyan",
  "gold",
  "grass",
  "gray",
  "green",
  "indigo",
  "lime",
  "mauve",
  "mint",
  "olive",
  "orange",
  "pink",
  "plum",
  "purple",
  "red",
  "sage",
  "sand",
  "sky",
  "slate",
  "teal",
  "tomato",
  "violet",
  "yellow",
  "jade",
  "iris",
  "ruby",
] as const;


export const ALPHAS: Alpha[] = ['', 'A'] as const;
export const P3S: P3[] = ['', 'P3'] as const;
export const STEPS: Step[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '-fg'] as const;
