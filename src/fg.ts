import { RadixHue } from "./types";

export function fg(hue: RadixHue | "white" | "black") {
  if (["sky", "mint", "lime", "yellow", "amber", "white"].includes(hue)) {
    return "black";
  }
  return "white";
}
