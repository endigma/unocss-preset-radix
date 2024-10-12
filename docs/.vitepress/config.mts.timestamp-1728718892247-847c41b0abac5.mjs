// docs/.vitepress/config.mts
import { defineConfig } from "file:///home/flyingseal/_Drive/Coding/unocss-preset-radix/node_modules/.pnpm/vitepress@1.0.0-rc.14_@algolia+client-search@4.20.0_search-insights@2.8.2/node_modules/vitepress/dist/node/index.js";
import { presetUno } from "file:///home/flyingseal/_Drive/Coding/unocss-preset-radix/node_modules/.pnpm/unocss@0.55.7_postcss@8.4.29_vite@4.4.9/node_modules/unocss/dist/index.mjs";

// src/preflights.ts
import * as radixColors from "file:///home/flyingseal/_Drive/Coding/unocss-preset-radix/node_modules/.pnpm/@radix-ui+colors@3.0.0/node_modules/@radix-ui/colors/index.js";

// src/colorsInUseHelpers.ts
var colorsInUse = {};
function getColorsInUse() {
  return colorsInUse;
}
function addColor({ hue, step, alpha }) {
  colorsInUse[hue] = colorsInUse[hue] ?? {};
  colorsInUse[hue].stepsInUse = colorsInUse[hue].stepsInUse ?? {};
  colorsInUse[hue].stepsInUse[`${step}${alpha}`] = { hue, step, alpha };
}

// src/aliasesInUseHelpers.ts
var aliasesInUse = {};
function getAliasesInUse() {
  return aliasesInUse;
}
function addStepToAnAlias({ alias, step, alpha }) {
  aliasesInUse[alias] = aliasesInUse[alias] ?? {};
  aliasesInUse[alias].stepsInUse = aliasesInUse[alias].stepsInUse ?? {};
  aliasesInUse[alias].possibleHues = aliasesInUse[alias].possibleHues ?? [];
  aliasesInUse[alias].stepsInUse[`${step}${alpha}`] = {
    step,
    alpha
    // we keep possible hues on aliasesInUse[alias].possibleHues, because each alias can be reassigned (through alias-danger-is-orange utility class) to another hue in different parts of html
  };
}
function addPossibleHueToAnAlias({ alias, possibleHue }) {
  aliasesInUse[alias] = aliasesInUse[alias] ?? {};
  aliasesInUse[alias].stepsInUse = aliasesInUse[alias].stepsInUse ?? {};
  aliasesInUse[alias].possibleHues = aliasesInUse[alias].possibleHues ?? [];
  if (!aliasesInUse[alias].possibleHues.includes(possibleHue)) {
    aliasesInUse[alias].possibleHues.push(possibleHue);
  }
}
function addScope({ alias, selector, hue }) {
  aliasesInUse[alias] = aliasesInUse[alias] ?? {};
  aliasesInUse[alias].scopes = aliasesInUse[alias].scopes ?? [];
  if (!aliasesInUse[alias].scopes[selector]) {
    aliasesInUse[alias].scopes[selector] = hue;
  }
}

// src/fg.ts
function fg(hue) {
  if (["sky", "mint", "lime", "yellow", "amber", "white"].includes(hue)) {
    return "black";
  }
  return "white";
}

// src/preflights.ts
function generateCSSVariablesForColorsInUse({
  darkSelector,
  lightSelector,
  prefix,
  useP3Colors,
  onlyOneTheme = null,
  aliases = {}
}) {
  const aliasesInUse2 = getAliasesInUse();
  for (const alias in aliasesInUse2) {
    for (const possibleHue of aliasesInUse2[alias].possibleHues) {
      for (const stepAlpha in aliasesInUse2[alias].stepsInUse) {
        const { alpha, step } = aliasesInUse2[alias].stepsInUse[stepAlpha];
        addColor({ hue: possibleHue, step, alpha });
      }
    }
  }
  const cssRules = {
    global: [],
    globalP3: [],
    lightTheme: [],
    lightThemeP3: [],
    darkTheme: [],
    darkThemeP3: []
  };
  const colorsInUse2 = getColorsInUse();
  for (const _hue in colorsInUse2) {
    for (const stepAlpha in colorsInUse2[_hue].stepsInUse) {
      const { hue, step, alpha } = colorsInUse2[_hue].stepsInUse[stepAlpha];
      if (["black", "white"].includes(hue) || step === "-fg") {
        cssRules.global.push(
          `--${prefix}-${hue}${step}${alpha}: ${getColorValue({ hue, step, alpha, dark: "", p3: "" })};`
        );
        if (useP3Colors) {
          cssRules.globalP3.push(
            `--${prefix}-${hue}${step}${alpha}: ${getColorValue({ hue, step, alpha, dark: "", p3: "P3" })};`
          );
        }
      } else {
        cssRules.lightTheme.push(
          `--${prefix}-${hue}${step}${alpha}: ${getColorValue({ hue, step, alpha, dark: "", p3: "" })};`
        );
        cssRules.darkTheme.push(
          `--${prefix}-${hue}${step}${alpha}: ${getColorValue({ hue, step, alpha, dark: "Dark", p3: "" })};`
        );
        if (useP3Colors) {
          cssRules.lightThemeP3.push(
            `--${prefix}-${hue}${step}${alpha}: ${getColorValue({ hue, step, alpha, dark: "", p3: "P3" })};`
          );
          cssRules.darkThemeP3.push(
            `--${prefix}-${hue}${step}${alpha}: ${getColorValue({
              hue,
              step,
              alpha,
              dark: "Dark",
              p3: "P3"
            })};`
          );
        }
      }
    }
  }
  for (const alias in aliasesInUse2) {
    const hue = aliases[alias];
    if (!hue)
      continue;
    for (const stepAlpha in aliasesInUse2[alias].stepsInUse) {
      cssRules.global.push(`--${prefix}-${alias}${stepAlpha}: var(--${prefix}-${hue}${stepAlpha});`);
    }
  }
  const scopeRules = {};
  for (const alias in aliasesInUse2) {
    const scopes = aliasesInUse2[alias].scopes;
    for (const selector in scopes) {
      const hue = scopes[selector];
      for (const stepAlpha in aliasesInUse2[alias].stepsInUse) {
        scopeRules[selector] ??= [];
        scopeRules[selector].push(`--${prefix}-${alias}${stepAlpha}: var(--${prefix}-${hue}${stepAlpha});`);
      }
    }
  }
  const scopeCss = Object.keys(scopeRules).map((selector) => {
    return `${selector} {
${scopeRules[selector].join("")}
}`;
  }).join("");
  let css = `:root {${[
    cssRules.global.join(""),
    onlyOneTheme === "light" ? cssRules.lightTheme.join("") : void 0,
    onlyOneTheme === "dark" ? cssRules.darkTheme.join("") : void 0
  ].join("")}}`;
  if (useP3Colors) {
    css = `${css}
@supports(color: color(display-p3 0 0 1)){:root{${[
      cssRules.globalP3.join(""),
      onlyOneTheme === "light" ? cssRules.lightThemeP3.join("") : void 0,
      onlyOneTheme === "dark" ? cssRules.darkThemeP3.join("") : void 0
    ].join("")}}}`;
  }
  css = `${css}
${scopeCss}`;
  if (!onlyOneTheme) {
    css = `${css}
${lightSelector} {${cssRules.lightTheme.join("")}}
${darkSelector} {${cssRules.darkTheme.join("")}}`;
    if (useP3Colors) {
      css = `${css}
@supports(color: color(display-p3 0 0 1)){${lightSelector} {${cssRules.lightThemeP3.join(
        ""
      )}} ${darkSelector} {${cssRules.darkThemeP3.join("")}}
}`;
    }
  }
  return css.replaceAll("\n\n", "\n").replaceAll("\n \n", "");
}
function getColorValue({
  hue,
  dark = "",
  step,
  alpha = "",
  p3 = ""
}) {
  if (step === "-fg")
    return fg(hue);
  let value = "";
  value = radixColors[`${hue}${dark}${p3}${alpha}`][`${hue}${alpha}${step}`];
  if (p3 === "P3") {
    if (alpha === "A")
      return value;
    if (alpha === "") {
      return value;
    }
  }
  if (p3 === "") {
    if (alpha === "A") {
      return value;
    }
    if (alpha === "") {
      return value;
    }
  }
}

// src/consts.ts
var RADIX_HUES = [
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
  "ruby"
];
var ALPHAS = ["", "A"];
var STEPS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "-fg"];

// src/extendTheme.ts
function extendTheme({
  theme,
  prefix,
  extend
}) {
  var _a, _b, _c, _d;
  const aliasesInUse2 = getAliasesInUse();
  theme.colors = {
    ...extend ? theme == null ? void 0 : theme.colors : [],
    transparent: "transparent",
    current: "currentColor",
    currentcolor: "currentColor",
    "current-color": "currentColor",
    inherit: "inherit",
    ...Object.fromEntries(
      [...RADIX_HUES, ...Object.keys(aliasesInUse2)].map((hueOrAlias) => {
        var _a2, _b2, _c2, _d2;
        let colorsOfSameHueInOriginalTheme = {};
        if ((_a2 = theme.colors) == null ? void 0 : _a2[hueOrAlias]) {
          if (typeof ((_b2 = theme.colors) == null ? void 0 : _b2[hueOrAlias]) === "string") {
            colorsOfSameHueInOriginalTheme = { DEFAULT: (_c2 = theme.colors) == null ? void 0 : _c2[hueOrAlias] };
          } else {
            colorsOfSameHueInOriginalTheme = (_d2 = theme.colors) == null ? void 0 : _d2[hueOrAlias];
          }
        }
        return [
          hueOrAlias,
          {
            ...extend ? colorsOfSameHueInOriginalTheme : {},
            "fg": `var(--${prefix}-${hueOrAlias}-fg)`,
            "1": `var(--${prefix}-${hueOrAlias}1)`,
            "2": `var(--${prefix}-${hueOrAlias}2)`,
            "3": `var(--${prefix}-${hueOrAlias}3)`,
            "4": `var(--${prefix}-${hueOrAlias}4)`,
            "5": `var(--${prefix}-${hueOrAlias}5)`,
            "6": `var(--${prefix}-${hueOrAlias}6)`,
            "7": `var(--${prefix}-${hueOrAlias}7)`,
            "8": `var(--${prefix}-${hueOrAlias}8)`,
            "9": `var(--${prefix}-${hueOrAlias}9)`,
            "10": `var(--${prefix}-${hueOrAlias}10)`,
            "11": `var(--${prefix}-${hueOrAlias}11)`,
            "12": `var(--${prefix}-${hueOrAlias}12)`,
            // put colors with alpha values inside var(...) so, unocss don't add extra opacity and break it.
            "1A": `var(--${prefix}-${hueOrAlias}1A)`,
            "2A": `var(--${prefix}-${hueOrAlias}2A)`,
            "3A": `var(--${prefix}-${hueOrAlias}3A)`,
            "4A": `var(--${prefix}-${hueOrAlias}4A)`,
            "5A": `var(--${prefix}-${hueOrAlias}5A)`,
            "6A": `var(--${prefix}-${hueOrAlias}6A)`,
            "7A": `var(--${prefix}-${hueOrAlias}7A)`,
            "8A": `var(--${prefix}-${hueOrAlias}8A)`,
            "9A": `var(--${prefix}-${hueOrAlias}9A)`,
            "10A": `var(--${prefix}-${hueOrAlias}10A)`,
            "11A": `var(--${prefix}-${hueOrAlias}11A)`,
            "12A": `var(--${prefix}-${hueOrAlias}12A)`
          }
        ];
      })
    ),
    white: {
      // if user has defind some variation for white (white-400 or white-warm)
      ...extend && typeof ((_a = theme == null ? void 0 : theme.colors) == null ? void 0 : _a["white"]) !== "string" ? (_b = theme == null ? void 0 : theme.colors) == null ? void 0 : _b["white"] : {},
      DEFAULT: "#ffffff",
      fg: "black",
      "1A": `var(--${prefix}-white1A)`,
      "2A": `var(--${prefix}-white2A)`,
      "3A": `var(--${prefix}-white3A)`,
      "4A": `var(--${prefix}-white4A)`,
      "5A": `var(--${prefix}-white5A)`,
      "6A": `var(--${prefix}-white6A)`,
      "7A": `var(--${prefix}-white7A)`,
      "8A": `var(--${prefix}-white8A)`,
      "9A": `var(--${prefix}-white9A)`,
      "10A": `var(--${prefix}-white10A)`,
      "11A": `var(--${prefix}-white11A)`,
      "12A": `var(--${prefix}-white12A)`
    },
    black: {
      ...extend && typeof ((_c = theme == null ? void 0 : theme.colors) == null ? void 0 : _c["white"]) !== "string" ? (_d = theme == null ? void 0 : theme.colors) == null ? void 0 : _d["white"] : {},
      DEFAULT: "#000000",
      fg: "white",
      "1A": `var(--${prefix}-black1A)`,
      "2A": `var(--${prefix}-black2A)`,
      "3A": `var(--${prefix}-black3A)`,
      "4A": `var(--${prefix}-black4A)`,
      "5A": `var(--${prefix}-black5A)`,
      "6A": `var(--${prefix}-black6A)`,
      "7A": `var(--${prefix}-black7A)`,
      "8A": `var(--${prefix}-black8A)`,
      "9A": `var(--${prefix}-black9A)`,
      "10A": `var(--${prefix}-black10A)`,
      "11A": `var(--${prefix}-black11A)`,
      "12A": `var(--${prefix}-black12A)`
    }
  };
}

// src/validation.ts
function isValidPrefix(prefix) {
  if (typeof prefix !== "string")
    return false;
  if (!prefix.match(/^[a-zA-Z0-9-_]+$/))
    return false;
  return true;
}
function isValidAliasName(aliasName) {
  if (typeof aliasName !== "string")
    return false;
  if (["white", "black", ...RADIX_HUES].includes(aliasName))
    return false;
  if (!aliasName.match(/^[a-z]+(-[a-z]+)*$/))
    return false;
  return true;
}
function isValidRadixHue(hue) {
  return RADIX_HUES.includes(hue);
}
function isValidColor({ hue, step, alpha }) {
  if (!isValidRadixHue(hue) && !["black", "white"].includes(hue))
    return false;
  if (step === "-fg" && alpha === "A")
    return false;
  if (["black", "white"].includes(hue) && alpha === "" && step !== "-fg")
    return false;
  return true;
}
function isValidAlias({
  alias,
  step,
  alpha,
  aliases
}) {
  const aliasesInUse2 = getAliasesInUse();
  if (!isValidAliasName(alias))
    return false;
  if (!(alias in filterValidAliases(aliases)) && !(alias in aliasesInUse2))
    return false;
  if (step === "-fg" && alpha === "A")
    return false;
  return true;
}
function filterValidAliases(aliases) {
  const validAliases = {};
  for (const alias in aliases) {
    const hue = aliases[alias];
    if (isValidAliasName(alias) && isValidRadixHue(hue))
      validAliases[alias] = hue;
  }
  return validAliases;
}
function filterValidSafelistColors(safelistColors) {
  const validSafelistColors = {};
  for (const safelistColor of safelistColors) {
    const match = safelistColor.match(/^([a-z]+)(1|2|3|4|5|6|7|8|9|10|11|12|-fg)?(A)?$/);
    if (!match)
      continue;
    const [token, hue, step = "", alpha = ""] = match;
    if (step) {
      if (!isValidColor({ hue, step, alpha }))
        continue;
      validSafelistColors[`${hue}${step}${alpha}`] = { hue, step, alpha };
    }
    if (!step) {
      for (const a of ALPHAS) {
        for (const sh of STEPS) {
          if (!isValidColor({ hue, step: sh, alpha: a }))
            continue;
          validSafelistColors[`${hue}${sh}${a}`] = { hue, step: sh, alpha: a };
        }
      }
    }
  }
  return validSafelistColors;
}
function filterValidSafelistAliases(safelistAliases, aliases) {
  const validSafelistAliases = {};
  for (const safelistAlias of safelistAliases) {
    const match = safelistAlias.match(/^([a-z]+(-[a-z]+)*)(1|2|3|4|5|6|7|8|9|10|11|12|-fg)?(A)?$/);
    if (!match)
      continue;
    const [token, alias, aliasInnerGroup, step = "", alpha = ""] = match;
    if (step) {
      if (!isValidAlias({ alias, step, alpha, aliases }))
        continue;
      validSafelistAliases[`${alias}${step}${alpha}`] = { alias, step, alpha };
    }
    if (!step) {
      for (const a of ALPHAS) {
        for (const sh of STEPS) {
          if (!isValidAlias({ alias, step: sh, alpha: a, aliases }))
            continue;
          validSafelistAliases[`${alias}${sh}${a}`] = { alias, step: sh, alpha: a };
        }
      }
    }
  }
  return validSafelistAliases;
}

// src/index.ts
function presetRadix({
  useP3Colors = false,
  prefix: _prefix = "--un-preset-radix-",
  darkSelector = ".dark-theme",
  lightSelector = ":root, .light-theme",
  aliases: _aliases,
  safelist,
  extend = false,
  onlyOneTheme,
  layer
}) {
  let prefix = isValidPrefix(_prefix) ? _prefix : "--un-preset-radix-";
  prefix = prefix.replaceAll("-", " ").trim().replaceAll(" ", "-");
  const safelistColors = filterValidSafelistColors(safelist ?? []);
  const aliases = filterValidAliases(_aliases ?? {});
  const safelistAliases = filterValidSafelistAliases(safelist ?? [], aliases);
  for (const safelistColor in safelistColors) {
    const { hue, step, alpha } = safelistColors[safelistColor];
    addColor({ hue, step, alpha });
  }
  for (const safelistAlias in safelistAliases) {
    const { alias, step, alpha } = safelistAliases[safelistAlias];
    const hue = aliases[alias];
    addPossibleHueToAnAlias({ alias, possibleHue: hue });
    addStepToAnAlias({ alias, step, alpha });
  }
  for (const safelistAlias in safelistAliases) {
    const { alias, step, alpha } = safelistAliases[safelistAlias];
  }
  for (const alias in aliases) {
    addPossibleHueToAnAlias({ alias, possibleHue: aliases[alias] });
  }
  return {
    name: "unocss-preset-radix",
    layers: layer ? {
      preflights: 1,
      [layer]: 2,
      default: 3
    } : void 0,
    shortcuts: [
      // This shortcut exist so generated css for colors to have same order.
      [/^(.*)-(transparent|white|black|current|current-color|inherit)$/, ([token]) => `${token}`, { layer: "default" }],
      // Detect usage of radix colors or aliases and handle it (by adding to colors in use). Preflight will generate css variables for based off colorsInUse and aliasesInUse.
      [
        /^([a-z]+(-[a-z]+)*)-([a-z]+)(1|2|3|4|5|6|7|8|9|10|11|12|-fg)(A)?$/,
        (match) => {
          if (!match)
            return;
          const [token, property, propertyInnerGroup, hueOrAlias, step, alpha = ""] = match;
          if (isValidColor({ hue: hueOrAlias, step, alpha })) {
            const hue = hueOrAlias;
            addColor({ hue, step, alpha });
          }
          if (isValidAlias({ alias: hueOrAlias, step, alpha, aliases })) {
            const alias = hueOrAlias;
            addStepToAnAlias({ alias, step, alpha });
          }
          return token;
        },
        { layer: "default" }
      ],
      // detect usage of dynamic aliasing and handle it.
      // using unocss shortcut instead of rule since shortcut runs earlier. So we are aware of all dynamic aliasing usage before processing alias usages
      // example: alias-warning-amber
      [
        /^alias-([a-z]+(-[a-z]+)*)-([a-z]+)$/,
        (match) => {
          if (!match)
            return;
          const [token, alias, aliasInnerGroup, hue] = match;
          if (!isValidRadixHue(hue))
            return "";
          if (!isValidAliasName(alias))
            return "";
          addPossibleHueToAnAlias({ alias, possibleHue: hue });
          addScope({ alias, selector: `.${token}`, hue });
          return;
        },
        { layer: "default" }
      ]
    ],
    rules: [
      // detect usage of radix colors or aliases as css variables and handle it.
      // examples: var(--un-preset-radix-pink9), var(--un-preset-radix-warning9A ), var(--uno-preset-radix-danger-fg, white)
      [
        /^var\(--([A-Za-z0-9\-\_]+)-([a-z]+)(1|2|3|4|5|6|7|8|9|10|11|12|-fg)(A)?(\)|,)?$/,
        (match) => {
          if (!match)
            return;
          const [token, matchedPrefix, hueOrAlias, step, alpha = "", closingBracketOrComma] = match;
          if (matchedPrefix !== prefix)
            return;
          if (isValidColor({ hue: hueOrAlias, step, alpha })) {
            const hue = hueOrAlias;
            addColor({ hue, step, alpha });
          }
          if (isValidAlias({ alias: hueOrAlias, step, alpha, aliases })) {
            const alias = hueOrAlias;
            addStepToAnAlias({ alias, step, alpha });
          }
          return "";
        },
        { layer: "default" }
      ]
    ],
    preflights: [
      {
        getCSS: (context) => {
          return generateCSSVariablesForColorsInUse({
            darkSelector,
            lightSelector,
            prefix,
            useP3Colors,
            onlyOneTheme,
            aliases
          });
        },
        layer
      }
    ],
    extendTheme: (theme) => {
      return extendTheme({ theme, prefix, extend });
    }
  };
}

// docs/.vitepress/config.mts
import unocss from "file:///home/flyingseal/_Drive/Coding/unocss-preset-radix/node_modules/.pnpm/unocss@0.55.7_postcss@8.4.29_vite@4.4.9/node_modules/unocss/dist/vite.mjs";
var config_default = defineConfig({
  title: "unocss-preset-radix",
  base: "/unocss-preset-radix/",
  vite: {
    plugins: [
      unocss({
        presets: [
          presetUno(),
          presetRadix({
            darkSelector: ".dark",
            aliases: {
              testa: "red",
              testb: "amber"
            },
            safelist: [...RADIX_HUES, "testa", "testb3", "testb5A", "testb-fg"]
          })
        ]
      })
    ]
  },
  description: "A unocss preset for radix colors",
  themeConfig: {
    nav: [{ text: "Home", link: "/" }],
    sidebar: [
      {
        text: "Guides",
        items: [
          { text: "Installation & Usage", link: "/v3/usage" },
          { text: "Configuration", link: "/v3/configuration" },
          { text: "Alias Utility", link: "/v3/alias-utility" },
          { text: "Migrating from v2", link: "/v3/migrating-from-v2" }
        ]
      },
      {
        text: "Other",
        items: [{ text: "Colors", link: "/colors" }]
      }
    ],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/endigma/unocss-preset-radix"
      }
    ]
  }
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZG9jcy8udml0ZXByZXNzL2NvbmZpZy5tdHMiLCAic3JjL3ByZWZsaWdodHMudHMiLCAic3JjL2NvbG9yc0luVXNlSGVscGVycy50cyIsICJzcmMvYWxpYXNlc0luVXNlSGVscGVycy50cyIsICJzcmMvZmcudHMiLCAic3JjL2NvbnN0cy50cyIsICJzcmMvZXh0ZW5kVGhlbWUudHMiLCAic3JjL3ZhbGlkYXRpb24udHMiLCAic3JjL2luZGV4LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvZmx5aW5nc2VhbC9fRHJpdmUvQ29kaW5nL3Vub2Nzcy1wcmVzZXQtcmFkaXgvZG9jcy8udml0ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9mbHlpbmdzZWFsL19Ecml2ZS9Db2RpbmcvdW5vY3NzLXByZXNldC1yYWRpeC9kb2NzLy52aXRlcHJlc3MvY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9mbHlpbmdzZWFsL19Ecml2ZS9Db2RpbmcvdW5vY3NzLXByZXNldC1yYWRpeC9kb2NzLy52aXRlcHJlc3MvY29uZmlnLm10c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlcHJlc3NcIjtcbmltcG9ydCB7IHByZXNldFVubyB9IGZyb20gXCJ1bm9jc3NcIjtcbmltcG9ydCB7IHByZXNldFJhZGl4IH0gZnJvbSBcIi4uLy4uL3NyY1wiO1xuaW1wb3J0IHVub2NzcyBmcm9tIFwidW5vY3NzL3ZpdGVcIjtcbmltcG9ydCB7IFJBRElYX0hVRVMgfSBmcm9tICcuLi8uLi9zcmMvY29uc3RzJztcblxuLy8gaHR0cHM6Ly92aXRlcHJlc3MuZGV2L3JlZmVyZW5jZS9zaXRlLWNvbmZpZ1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgdGl0bGU6IFwidW5vY3NzLXByZXNldC1yYWRpeFwiLFxuICBiYXNlOiBcIi91bm9jc3MtcHJlc2V0LXJhZGl4L1wiLFxuICB2aXRlOiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgdW5vY3NzKHtcbiAgICAgICAgcHJlc2V0czogW1xuICAgICAgICAgIHByZXNldFVubygpLFxuICAgICAgICAgIHByZXNldFJhZGl4KHtcbiAgICAgICAgICAgIGRhcmtTZWxlY3RvcjogXCIuZGFya1wiLFxuICAgICAgICAgICAgYWxpYXNlczoge1xuICAgICAgICAgICAgICB0ZXN0YTogXCJyZWRcIixcbiAgICAgICAgICAgICAgdGVzdGI6IFwiYW1iZXJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzYWZlbGlzdDogWy4uLlJBRElYX0hVRVMgLCBcInRlc3RhXCIsIFwidGVzdGIzXCIsXCJ0ZXN0YjVBXCIgLCBcInRlc3RiLWZnXCJdLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSksXG4gICAgXSxcbiAgfSxcbiAgZGVzY3JpcHRpb246IFwiQSB1bm9jc3MgcHJlc2V0IGZvciByYWRpeCBjb2xvcnNcIixcbiAgdGhlbWVDb25maWc6IHtcbiAgICBuYXY6IFt7IHRleHQ6IFwiSG9tZVwiLCBsaW5rOiBcIi9cIiB9XSxcbiAgICBzaWRlYmFyOiBbXG4gICAgICB7XG4gICAgICAgIHRleHQ6IFwiR3VpZGVzXCIsXG4gICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgeyB0ZXh0OiBcIkluc3RhbGxhdGlvbiAmIFVzYWdlXCIsIGxpbms6IFwiL3YzL3VzYWdlXCIgfSxcbiAgICAgICAgICB7IHRleHQ6IFwiQ29uZmlndXJhdGlvblwiLCBsaW5rOiBcIi92My9jb25maWd1cmF0aW9uXCIgfSxcbiAgICAgICAgICB7IHRleHQ6IFwiQWxpYXMgVXRpbGl0eVwiLCBsaW5rOiBcIi92My9hbGlhcy11dGlsaXR5XCIgfSxcbiAgICAgICAgICB7IHRleHQ6IFwiTWlncmF0aW5nIGZyb20gdjJcIiwgbGluazogXCIvdjMvbWlncmF0aW5nLWZyb20tdjJcIiB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGV4dDogXCJPdGhlclwiLFxuICAgICAgICBpdGVtczogW3sgdGV4dDogXCJDb2xvcnNcIiwgbGluazogXCIvY29sb3JzXCIgfV0sXG4gICAgICB9LFxuICAgIF0sXG5cbiAgICBzb2NpYWxMaW5rczogW1xuICAgICAge1xuICAgICAgICBpY29uOiBcImdpdGh1YlwiLFxuICAgICAgICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9lbmRpZ21hL3Vub2Nzcy1wcmVzZXQtcmFkaXhcIixcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbn0pO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9mbHlpbmdzZWFsL19Ecml2ZS9Db2RpbmcvdW5vY3NzLXByZXNldC1yYWRpeC9zcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2ZseWluZ3NlYWwvX0RyaXZlL0NvZGluZy91bm9jc3MtcHJlc2V0LXJhZGl4L3NyYy9wcmVmbGlnaHRzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2ZseWluZ3NlYWwvX0RyaXZlL0NvZGluZy91bm9jc3MtcHJlc2V0LXJhZGl4L3NyYy9wcmVmbGlnaHRzLnRzXCI7aW1wb3J0IHsgQWxwaGEsIERhcmssIFAzLCBSYWRpeEh1ZSwgU3RlcCwgU3RlcEFscGhhIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgKiBhcyByYWRpeENvbG9ycyBmcm9tICdAcmFkaXgtdWkvY29sb3JzJztcbmltcG9ydCAqIGFzIGNvbG9yc0luVXNlSGVscGVycyBmcm9tICcuL2NvbG9yc0luVXNlSGVscGVycyc7XG5pbXBvcnQgKiBhcyBhbGlhc2VzSW5Vc2VIZWxwZXJzIGZyb20gJy4vYWxpYXNlc0luVXNlSGVscGVycyc7XG5pbXBvcnQgeyBmZyB9IGZyb20gJy4vZmcnO1xuXG50eXBlIFByb3BzID0ge1xuICBkYXJrU2VsZWN0b3I6IHN0cmluZztcbiAgbGlnaHRTZWxlY3Rvcjogc3RyaW5nO1xuICBwcmVmaXg6IHN0cmluZztcbiAgdXNlUDNDb2xvcnM6IGJvb2xlYW47XG4gIG9ubHlPbmVUaGVtZT86IHN0cmluZyB8IG51bGw7XG4gIGFsaWFzZXM6IFJlY29yZDxzdHJpbmcsIFJhZGl4SHVlPjtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUNTU1ZhcmlhYmxlc0ZvckNvbG9yc0luVXNlKHtcbiAgZGFya1NlbGVjdG9yLFxuICBsaWdodFNlbGVjdG9yLFxuICBwcmVmaXgsXG4gIHVzZVAzQ29sb3JzLFxuICBvbmx5T25lVGhlbWUgPSBudWxsLFxuICBhbGlhc2VzID0ge30sXG59OiBQcm9wcyk6IHN0cmluZyB7XG4gIGNvbnN0IGFsaWFzZXNJblVzZSA9IGFsaWFzZXNJblVzZUhlbHBlcnMuZ2V0QWxpYXNlc0luVXNlKCk7XG5cbiAgLy8gZm9yIGFsbCBhbGlhcy1zdGVwLWFscGhhIHVzZWQsIGFkZCBjb3JyZXNwb25kaW5nIGNvbG9ycyAob3IgcG9zc2libGUgY29sb3JzKSB0byBjb2xvcnNJbnVzZVxuICBmb3IgKGNvbnN0IGFsaWFzIGluIGFsaWFzZXNJblVzZSkge1xuICAgIGZvciAoY29uc3QgcG9zc2libGVIdWUgb2YgYWxpYXNlc0luVXNlW2FsaWFzXS5wb3NzaWJsZUh1ZXMpIHtcbiAgICAgIGZvciAoY29uc3Qgc3RlcEFscGhhIGluIGFsaWFzZXNJblVzZVthbGlhc10uc3RlcHNJblVzZSkge1xuICAgICAgICBjb25zdCB7IGFscGhhLCBzdGVwIH0gPSBhbGlhc2VzSW5Vc2VbYWxpYXNdLnN0ZXBzSW5Vc2Vbc3RlcEFscGhhIGFzIFN0ZXBBbHBoYV07XG4gICAgICAgIGNvbG9yc0luVXNlSGVscGVycy5hZGRDb2xvcih7IGh1ZTogcG9zc2libGVIdWUsIHN0ZXAsIGFscGhhIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGNzc1J1bGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT4gPSB7XG4gICAgZ2xvYmFsOiBbXSxcbiAgICBnbG9iYWxQMzogW10sXG4gICAgbGlnaHRUaGVtZTogW10sXG4gICAgbGlnaHRUaGVtZVAzOiBbXSxcbiAgICBkYXJrVGhlbWU6IFtdLFxuICAgIGRhcmtUaGVtZVAzOiBbXSxcbiAgfTtcblxuICBjb25zdCBjb2xvcnNJblVzZSA9IGNvbG9yc0luVXNlSGVscGVycy5nZXRDb2xvcnNJblVzZSgpO1xuXG4gIGZvciAoY29uc3QgX2h1ZSBpbiBjb2xvcnNJblVzZSkge1xuICAgIGZvciAoY29uc3Qgc3RlcEFscGhhIGluIGNvbG9yc0luVXNlW19odWUgYXMgUmFkaXhIdWUgfCAnYmxhY2snIHwgJ3doaXRlJ10uc3RlcHNJblVzZSkge1xuICAgICAgY29uc3QgeyBodWUsIHN0ZXAsIGFscGhhIH0gPVxuICAgICAgICBjb2xvcnNJblVzZVtfaHVlIGFzIFJhZGl4SHVlIHwgJ2JsYWNrJyB8ICd3aGl0ZSddLnN0ZXBzSW5Vc2Vbc3RlcEFscGhhIGFzIFN0ZXBBbHBoYV07XG5cbiAgICAgIGlmIChbJ2JsYWNrJywgJ3doaXRlJ10uaW5jbHVkZXMoaHVlKSB8fCBzdGVwID09PSAnLWZnJykge1xuICAgICAgICBjc3NSdWxlcy5nbG9iYWwucHVzaChcbiAgICAgICAgICBgLS0ke3ByZWZpeH0tJHtodWV9JHtzdGVwfSR7YWxwaGF9OiAke2dldENvbG9yVmFsdWUoeyBodWUsIHN0ZXAsIGFscGhhLCBkYXJrOiAnJywgcDM6ICcnIH0pfTtgXG4gICAgICAgICk7XG4gICAgICAgIGlmICh1c2VQM0NvbG9ycykge1xuICAgICAgICAgIGNzc1J1bGVzLmdsb2JhbFAzLnB1c2goXG4gICAgICAgICAgICBgLS0ke3ByZWZpeH0tJHtodWV9JHtzdGVwfSR7YWxwaGF9OiAke2dldENvbG9yVmFsdWUoeyBodWUsIHN0ZXAsIGFscGhhLCBkYXJrOiAnJywgcDM6ICdQMycgfSl9O2BcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjc3NSdWxlcy5saWdodFRoZW1lLnB1c2goXG4gICAgICAgICAgYC0tJHtwcmVmaXh9LSR7aHVlfSR7c3RlcH0ke2FscGhhfTogJHtnZXRDb2xvclZhbHVlKHsgaHVlLCBzdGVwLCBhbHBoYSwgZGFyazogJycsIHAzOiAnJyB9KX07YFxuICAgICAgICApO1xuICAgICAgICBjc3NSdWxlcy5kYXJrVGhlbWUucHVzaChcbiAgICAgICAgICBgLS0ke3ByZWZpeH0tJHtodWV9JHtzdGVwfSR7YWxwaGF9OiAke2dldENvbG9yVmFsdWUoeyBodWUsIHN0ZXAsIGFscGhhLCBkYXJrOiAnRGFyaycsIHAzOiAnJyB9KX07YFxuICAgICAgICApO1xuICAgICAgICBpZiAodXNlUDNDb2xvcnMpIHtcbiAgICAgICAgICBjc3NSdWxlcy5saWdodFRoZW1lUDMucHVzaChcbiAgICAgICAgICAgIGAtLSR7cHJlZml4fS0ke2h1ZX0ke3N0ZXB9JHthbHBoYX06ICR7Z2V0Q29sb3JWYWx1ZSh7IGh1ZSwgc3RlcCwgYWxwaGEsIGRhcms6ICcnLCBwMzogJ1AzJyB9KX07YFxuICAgICAgICAgICk7XG4gICAgICAgICAgY3NzUnVsZXMuZGFya1RoZW1lUDMucHVzaChcbiAgICAgICAgICAgIGAtLSR7cHJlZml4fS0ke2h1ZX0ke3N0ZXB9JHthbHBoYX06ICR7Z2V0Q29sb3JWYWx1ZSh7XG4gICAgICAgICAgICAgIGh1ZSxcbiAgICAgICAgICAgICAgc3RlcCxcbiAgICAgICAgICAgICAgYWxwaGEsXG4gICAgICAgICAgICAgIGRhcms6ICdEYXJrJyxcbiAgICAgICAgICAgICAgcDM6ICdQMycsXG4gICAgICAgICAgICB9KX07YFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IGFsaWFzIGluIGFsaWFzZXNJblVzZSkge1xuICAgIGNvbnN0IGh1ZSA9IGFsaWFzZXNbYWxpYXNdO1xuICAgIC8vIGZvciBodWVzIHRoYXQgYXJlIG5vdCBkZWZpbmVkIGluIHRoZSBhbGlhc2VzIChkZWZpbmVkIHZpYSBkeW5hbWljIGFsaWFzaW5nKSwgc2tpcC5cbiAgICBpZiAoIWh1ZSkgY29udGludWU7XG4gICAgZm9yIChjb25zdCBzdGVwQWxwaGEgaW4gYWxpYXNlc0luVXNlW2FsaWFzXS5zdGVwc0luVXNlKSB7XG4gICAgICBjc3NSdWxlcy5nbG9iYWwucHVzaChgLS0ke3ByZWZpeH0tJHthbGlhc30ke3N0ZXBBbHBoYX06IHZhcigtLSR7cHJlZml4fS0ke2h1ZX0ke3N0ZXBBbHBoYX0pO2ApO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHNjb3BlUnVsZXMgPSB7fSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT47XG5cbiAgZm9yIChjb25zdCBhbGlhcyBpbiBhbGlhc2VzSW5Vc2UpIHtcbiAgICBjb25zdCBzY29wZXMgPSBhbGlhc2VzSW5Vc2VbYWxpYXNdLnNjb3BlcztcblxuICAgIGZvciAoY29uc3Qgc2VsZWN0b3IgaW4gc2NvcGVzKSB7XG4gICAgICBjb25zdCBodWUgPSBzY29wZXNbc2VsZWN0b3JdO1xuICAgICAgZm9yIChjb25zdCBzdGVwQWxwaGEgaW4gYWxpYXNlc0luVXNlW2FsaWFzXS5zdGVwc0luVXNlKSB7XG4gICAgICAgIHNjb3BlUnVsZXNbc2VsZWN0b3JdID8/PSBbXTtcbiAgICAgICAgc2NvcGVSdWxlc1tzZWxlY3Rvcl0ucHVzaChgLS0ke3ByZWZpeH0tJHthbGlhc30ke3N0ZXBBbHBoYX06IHZhcigtLSR7cHJlZml4fS0ke2h1ZX0ke3N0ZXBBbHBoYX0pO2ApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHNjb3BlQ3NzID0gT2JqZWN0LmtleXMoc2NvcGVSdWxlcylcbiAgICAubWFwKChzZWxlY3RvcikgPT4ge1xuICAgICAgcmV0dXJuIGAke3NlbGVjdG9yfSB7XG4ke3Njb3BlUnVsZXNbc2VsZWN0b3JdLmpvaW4oJycpfVxufWA7XG4gICAgfSlcbiAgICAuam9pbignJyk7XG5cbiAgbGV0IGNzcyA9IGA6cm9vdCB7JHtbXG4gICAgY3NzUnVsZXMuZ2xvYmFsLmpvaW4oJycpLFxuICAgIG9ubHlPbmVUaGVtZSA9PT0gJ2xpZ2h0JyA/IGNzc1J1bGVzLmxpZ2h0VGhlbWUuam9pbignJykgOiB1bmRlZmluZWQsXG4gICAgb25seU9uZVRoZW1lID09PSAnZGFyaycgPyBjc3NSdWxlcy5kYXJrVGhlbWUuam9pbignJykgOiB1bmRlZmluZWQsXG4gIF0uam9pbignJyl9fWA7XG5cbiAgaWYgKHVzZVAzQ29sb3JzKSB7XG4gICAgY3NzID0gYCR7Y3NzfVxuQHN1cHBvcnRzKGNvbG9yOiBjb2xvcihkaXNwbGF5LXAzIDAgMCAxKSl7OnJvb3R7JHtbXG4gICAgICBjc3NSdWxlcy5nbG9iYWxQMy5qb2luKCcnKSxcbiAgICAgIG9ubHlPbmVUaGVtZSA9PT0gJ2xpZ2h0JyA/IGNzc1J1bGVzLmxpZ2h0VGhlbWVQMy5qb2luKCcnKSA6IHVuZGVmaW5lZCxcbiAgICAgIG9ubHlPbmVUaGVtZSA9PT0gJ2RhcmsnID8gY3NzUnVsZXMuZGFya1RoZW1lUDMuam9pbignJykgOiB1bmRlZmluZWQsXG4gICAgXS5qb2luKCcnKX19fWA7XG4gIH1cblxuICBjc3MgPSBgJHtjc3N9XG4ke3Njb3BlQ3NzfWA7XG5cbiAgLy8gIGlmIGJvdGggbGlnaHQgYW5kIGRhcmsgdGhlbWUgZXhpc3RcbiAgaWYgKCFvbmx5T25lVGhlbWUpIHtcbiAgICBjc3MgPSBgJHtjc3N9XG4ke2xpZ2h0U2VsZWN0b3J9IHske2Nzc1J1bGVzLmxpZ2h0VGhlbWUuam9pbignJyl9fVxuJHtkYXJrU2VsZWN0b3J9IHske2Nzc1J1bGVzLmRhcmtUaGVtZS5qb2luKCcnKX19YDtcblxuICAgIGlmICh1c2VQM0NvbG9ycykge1xuICAgICAgY3NzID0gYCR7Y3NzfVxuQHN1cHBvcnRzKGNvbG9yOiBjb2xvcihkaXNwbGF5LXAzIDAgMCAxKSl7JHtsaWdodFNlbGVjdG9yfSB7JHtjc3NSdWxlcy5saWdodFRoZW1lUDMuam9pbihcbiAgICAgICAgJydcbiAgICAgICl9fSAke2RhcmtTZWxlY3Rvcn0geyR7Y3NzUnVsZXMuZGFya1RoZW1lUDMuam9pbignJyl9fVxufWA7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNzcy5yZXBsYWNlQWxsKCdcXG5cXG4nLCAnXFxuJykucmVwbGFjZUFsbCgnXFxuIFxcbicsICcnKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29sb3JWYWx1ZSh7XG4gIGh1ZSxcbiAgZGFyayA9ICcnLFxuICBzdGVwLFxuICBhbHBoYSA9ICcnLFxuICBwMyA9ICcnLFxufToge1xuICBhbHBoYT86IEFscGhhO1xuICBodWU6IFJhZGl4SHVlIHwgJ2JsYWNrJyB8ICd3aGl0ZSc7XG4gIGRhcms/OiBEYXJrO1xuICBzdGVwOiBTdGVwO1xuICBwMz86IFAzO1xufSkge1xuICBpZiAoc3RlcCA9PT0gJy1mZycpIHJldHVybiBmZyhodWUpO1xuXG4gIGxldCB2YWx1ZSA9ICcnO1xuICAvL0B0cy1pZ25vcmVcbiAgdmFsdWUgPSByYWRpeENvbG9yc1tgJHtodWV9JHtkYXJrfSR7cDN9JHthbHBoYX1gXVtgJHtodWV9JHthbHBoYX0ke3N0ZXB9YF07XG5cbiAgaWYgKHAzID09PSAnUDMnKSB7XG4gICAgaWYgKGFscGhhID09PSAnQScpIHJldHVybiB2YWx1ZTtcbiAgICBpZiAoYWxwaGEgPT09ICcnKSB7XG4gICAgICAvLyByZXR1cm4gaW4gcDMgZm9ybWF0IGV4OiAnMSA0IDUnXG4gICAgICAvLyBzbyB3ZSBjYW4gdXNlIHRhaWx3aW5kIG9wYWNpdHkgKGJnLW9wYWNpdHktMzAgb3IgYmctYmx1ZTkvMzApIHdpdGggaXRcbiAgICAgIC8vIHJldHVybiB2YWx1ZS5yZXBsYWNlKCdjb2xvcihkaXNwbGF5LXAzJywgJycpLnJlcGxhY2UoJyknLCAnJykudHJpbSgpO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGlmIChwMyA9PT0gJycpIHtcbiAgICAvLyBjb252ZXJ0IEhleCBvciByZ2IgdmFsdWVzIHRvIHJnYiB2YWx1ZXNcbiAgICAvLyBjb25zdCBjb2xvciA9IG5ldyBDb2xvcih2YWx1ZSk7XG5cbiAgICBpZiAoYWxwaGEgPT09ICdBJykge1xuICAgICAgLy8gdmFsdWUgPSBjb2xvci50b1N0cmluZyh7IGZvcm1hdDogJ3JnYicsIHByZWNpc2lvbjogNCB9KTtcbiAgICAgIHJldHVybiB2YWx1ZTsgLy8gcHV0IGl0IGluc2lkZSB2YXIoKSBzbyB1bm9jc3MgY2FuIG5vdCBhZGQgb3BhY2l0eSB0byBpdC5cbiAgICB9XG4gICAgaWYgKGFscGhhID09PSAnJykge1xuICAgICAgLy8gY29udmVydCAncmdiKDEwMCA0MCA1MCknIHRvICcxMDAgNDAgNTAnIHRvIGJlIHVzZWQgaW4gcmdiKCAgLyA8YWxwaGEtdmFsdWU+KVxuICAgICAgLy8gc28gd2UgY2FuIHVzZSB0YWlsd2luZCBvcGFjaXR5IChiZy1vcGFjaXR5LTMwIG9yIGJnLWJsdWU5LzMwKSB3aXRoIGl0XG4gICAgICAvLyB2YWx1ZSA9IGNvbG9yLnRvU3RyaW5nKHsgZm9ybWF0OiAncmdiYScsIHByZWNpc2lvbjogNCB9KTtcbiAgICAgIC8vIHJldHVybiB2YWx1ZS5yZXBsYWNlKCdyZ2JhKCcsICcnKS5yZXBsYWNlKCcpJywgJycpLnRyaW0oKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gIH1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvZmx5aW5nc2VhbC9fRHJpdmUvQ29kaW5nL3Vub2Nzcy1wcmVzZXQtcmFkaXgvc3JjXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9mbHlpbmdzZWFsL19Ecml2ZS9Db2RpbmcvdW5vY3NzLXByZXNldC1yYWRpeC9zcmMvY29sb3JzSW5Vc2VIZWxwZXJzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2ZseWluZ3NlYWwvX0RyaXZlL0NvZGluZy91bm9jc3MtcHJlc2V0LXJhZGl4L3NyYy9jb2xvcnNJblVzZUhlbHBlcnMudHNcIjtpbXBvcnQge1xuICBBbHBoYSxcbiAgUmFkaXhIdWUsXG4gIFN0ZXAsXG4gIFN0ZXBBbHBoYSxcbn0gZnJvbSAnLi90eXBlcyc7XG5cbmV4cG9ydCB0eXBlIENvbG9yUHJvcGVydGllcyA9IHtcbiAgc3RlcDogU3RlcDtcbiAgYWxwaGE6IEFscGhhO1xuICBodWU6IFJhZGl4SHVlIHwgJ2JsYWNrJyB8ICd3aGl0ZSc7XG59O1xuXG5cbmV4cG9ydCB0eXBlIENvbG9ySW5Vc2UgPSB7XG4gIHN0ZXBzSW5Vc2U6IFJlY29yZDxTdGVwQWxwaGEsIENvbG9yUHJvcGVydGllcz47XG59O1xuXG5leHBvcnQgdHlwZSBDb2xvcnNJblVzZSA9IFJlY29yZDxSYWRpeEh1ZSB8ICdibGFjaycgfCAnd2hpdGUnLCBDb2xvckluVXNlPjtcblxuXG5cbmNvbnN0IGNvbG9yc0luVXNlID0ge30gYXMgQ29sb3JzSW5Vc2U7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb2xvcnNJblVzZSgpIHtcbiAgcmV0dXJuIGNvbG9yc0luVXNlIGFzIFJlYWRvbmx5PENvbG9yc0luVXNlPjtcbn1cblxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZENvbG9yKHsgaHVlLCBzdGVwLCBhbHBoYSB9OiB7IGh1ZTogUmFkaXhIdWUgfCAnYmxhY2snIHwgJ3doaXRlJzsgc3RlcDogU3RlcDsgYWxwaGE6IEFscGhhIH0pIHtcbiAgY29sb3JzSW5Vc2VbaHVlXSA9IGNvbG9yc0luVXNlW2h1ZV0gPz8ge307XG4gIGNvbG9yc0luVXNlW2h1ZV0uc3RlcHNJblVzZSA9IGNvbG9yc0luVXNlW2h1ZV0uc3RlcHNJblVzZSA/PyB7fTtcbiAgY29sb3JzSW5Vc2VbaHVlXS5zdGVwc0luVXNlW2Ake3N0ZXB9JHthbHBoYX1gIGFzIFN0ZXBBbHBoYV0gPSB7IGh1ZSwgc3RlcCwgYWxwaGEgfTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvZmx5aW5nc2VhbC9fRHJpdmUvQ29kaW5nL3Vub2Nzcy1wcmVzZXQtcmFkaXgvc3JjXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9mbHlpbmdzZWFsL19Ecml2ZS9Db2RpbmcvdW5vY3NzLXByZXNldC1yYWRpeC9zcmMvYWxpYXNlc0luVXNlSGVscGVycy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9mbHlpbmdzZWFsL19Ecml2ZS9Db2RpbmcvdW5vY3NzLXByZXNldC1yYWRpeC9zcmMvYWxpYXNlc0luVXNlSGVscGVycy50c1wiO2ltcG9ydCB7XG4gIEFsaWFzLFxuICBBbHBoYSxcbiAgLy8gQ29sb3JzSW5Vc2UsXG4gIFJhZGl4SHVlLFxuICBTdGVwLFxuICBTdGVwQWxwaGEsXG59IGZyb20gJy4vdHlwZXMnO1xuXG50eXBlIEFsaWFzUHJvcGVydGllcyA9IHtcbiAgc3RlcDogU3RlcDtcbiAgYWxwaGE6IEFscGhhO1xufTtcblxudHlwZSBTZWxlY3RvciA9IHN0cmluZztcblxudHlwZSBBbGlhc0luVXNlID0ge1xuICBzdGVwc0luVXNlOiBSZWNvcmQ8U3RlcEFscGhhLCBBbGlhc1Byb3BlcnRpZXM+O1xuICBwb3NzaWJsZUh1ZXM6IFJhZGl4SHVlW11cbiAgc2NvcGVzOiBSZWNvcmQ8U2VsZWN0b3IsIFJhZGl4SHVlPjtcbn07XG5cbnR5cGUgQWxpYXNlc0luVXNlID0gUmVjb3JkPHN0cmluZywgQWxpYXNJblVzZT47XG5cbmNvbnN0IGFsaWFzZXNJblVzZSA9IHt9IGFzIEFsaWFzZXNJblVzZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFsaWFzZXNJblVzZSgpIHtcbiAgcmV0dXJuIGFsaWFzZXNJblVzZSBhcyBSZWFkb25seTxBbGlhc2VzSW5Vc2U+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkU3RlcFRvQW5BbGlhcyh7IGFsaWFzLCBzdGVwLCBhbHBoYSB9OiB7IGFsaWFzOiBBbGlhczsgc3RlcDogU3RlcDsgYWxwaGE6IEFscGhhIH0pIHtcbiAgYWxpYXNlc0luVXNlW2FsaWFzXSA9IGFsaWFzZXNJblVzZVthbGlhc10gPz8ge307XG4gIGFsaWFzZXNJblVzZVthbGlhc10uc3RlcHNJblVzZSA9IGFsaWFzZXNJblVzZVthbGlhc10uc3RlcHNJblVzZSA/PyB7fTtcbiAgYWxpYXNlc0luVXNlW2FsaWFzXS5wb3NzaWJsZUh1ZXMgPSBhbGlhc2VzSW5Vc2VbYWxpYXNdLnBvc3NpYmxlSHVlcyA/PyBbXTtcblxuICBhbGlhc2VzSW5Vc2VbYWxpYXNdLnN0ZXBzSW5Vc2VbYCR7c3RlcH0ke2FscGhhfWAgYXMgU3RlcEFscGhhXSA9IHtcbiAgICBzdGVwLFxuICAgIGFscGhhLFxuICAgIC8vIHdlIGtlZXAgcG9zc2libGUgaHVlcyBvbiBhbGlhc2VzSW5Vc2VbYWxpYXNdLnBvc3NpYmxlSHVlcywgYmVjYXVzZSBlYWNoIGFsaWFzIGNhbiBiZSByZWFzc2lnbmVkICh0aHJvdWdoIGFsaWFzLWRhbmdlci1pcy1vcmFuZ2UgdXRpbGl0eSBjbGFzcykgdG8gYW5vdGhlciBodWUgaW4gZGlmZmVyZW50IHBhcnRzIG9mIGh0bWxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFBvc3NpYmxlSHVlVG9BbkFsaWFzKHsgYWxpYXMsIHBvc3NpYmxlSHVlIH06IHsgYWxpYXM6IEFsaWFzOyBwb3NzaWJsZUh1ZTogUmFkaXhIdWUsIHNjb3BlPzogc3RyaW5nIH0pIHtcbiAgYWxpYXNlc0luVXNlW2FsaWFzXSA9IGFsaWFzZXNJblVzZVthbGlhc10gPz8ge307XG4gIGFsaWFzZXNJblVzZVthbGlhc10uc3RlcHNJblVzZSA9IGFsaWFzZXNJblVzZVthbGlhc10uc3RlcHNJblVzZSA/PyB7fTtcbiAgYWxpYXNlc0luVXNlW2FsaWFzXS5wb3NzaWJsZUh1ZXMgPSBhbGlhc2VzSW5Vc2VbYWxpYXNdLnBvc3NpYmxlSHVlcyA/PyBbXTtcblxuICBpZiAoIWFsaWFzZXNJblVzZVthbGlhc10ucG9zc2libGVIdWVzLmluY2x1ZGVzKHBvc3NpYmxlSHVlKSkge1xuICAgIGFsaWFzZXNJblVzZVthbGlhc10ucG9zc2libGVIdWVzLnB1c2gocG9zc2libGVIdWUpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRTY29wZSh7IGFsaWFzLCBzZWxlY3RvciwgaHVlIH06IHsgYWxpYXM6IEFsaWFzOyBzZWxlY3Rvcjogc3RyaW5nLCBodWU6IFJhZGl4SHVlIH0pIHtcbiAgYWxpYXNlc0luVXNlW2FsaWFzXSA9IGFsaWFzZXNJblVzZVthbGlhc10gPz8ge307XG4gIGFsaWFzZXNJblVzZVthbGlhc10uc2NvcGVzID0gYWxpYXNlc0luVXNlW2FsaWFzXS5zY29wZXMgPz8gW107XG4gIGlmICghYWxpYXNlc0luVXNlW2FsaWFzXS5zY29wZXNbc2VsZWN0b3JdKSB7XG4gICAgYWxpYXNlc0luVXNlW2FsaWFzXS5zY29wZXNbc2VsZWN0b3JdID0gaHVlO1xuICB9XG59XG5cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvZmx5aW5nc2VhbC9fRHJpdmUvQ29kaW5nL3Vub2Nzcy1wcmVzZXQtcmFkaXgvc3JjXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9mbHlpbmdzZWFsL19Ecml2ZS9Db2RpbmcvdW5vY3NzLXByZXNldC1yYWRpeC9zcmMvZmcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvZmx5aW5nc2VhbC9fRHJpdmUvQ29kaW5nL3Vub2Nzcy1wcmVzZXQtcmFkaXgvc3JjL2ZnLnRzXCI7aW1wb3J0IHsgUmFkaXhIdWUgfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGZnKGh1ZTogUmFkaXhIdWUgfCAnd2hpdGUnIHwgJ2JsYWNrJykge1xuICBpZiAoW1wic2t5XCIsIFwibWludFwiLCBcImxpbWVcIiwgXCJ5ZWxsb3dcIiwgXCJhbWJlclwiLCBcIndoaXRlXCJdLmluY2x1ZGVzKGh1ZSkpIHtcbiAgICByZXR1cm4gXCJibGFja1wiO1xuICB9XG4gIHJldHVybiBcIndoaXRlXCI7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2ZseWluZ3NlYWwvX0RyaXZlL0NvZGluZy91bm9jc3MtcHJlc2V0LXJhZGl4L3NyY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvZmx5aW5nc2VhbC9fRHJpdmUvQ29kaW5nL3Vub2Nzcy1wcmVzZXQtcmFkaXgvc3JjL2NvbnN0cy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9mbHlpbmdzZWFsL19Ecml2ZS9Db2RpbmcvdW5vY3NzLXByZXNldC1yYWRpeC9zcmMvY29uc3RzLnRzXCI7aW1wb3J0IHsgQWxwaGEsIFAzLCBTdGVwIH0gZnJvbSAnLi90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBSQURJWF9IVUVTID0gW1xuICBcImFtYmVyXCIsXG4gIFwiYmx1ZVwiLFxuICBcImJyb256ZVwiLFxuICBcImJyb3duXCIsXG4gIFwiY3JpbXNvblwiLFxuICBcImN5YW5cIixcbiAgXCJnb2xkXCIsXG4gIFwiZ3Jhc3NcIixcbiAgXCJncmF5XCIsXG4gIFwiZ3JlZW5cIixcbiAgXCJpbmRpZ29cIixcbiAgXCJsaW1lXCIsXG4gIFwibWF1dmVcIixcbiAgXCJtaW50XCIsXG4gIFwib2xpdmVcIixcbiAgXCJvcmFuZ2VcIixcbiAgXCJwaW5rXCIsXG4gIFwicGx1bVwiLFxuICBcInB1cnBsZVwiLFxuICBcInJlZFwiLFxuICBcInNhZ2VcIixcbiAgXCJzYW5kXCIsXG4gIFwic2t5XCIsXG4gIFwic2xhdGVcIixcbiAgXCJ0ZWFsXCIsXG4gIFwidG9tYXRvXCIsXG4gIFwidmlvbGV0XCIsXG4gIFwieWVsbG93XCIsXG4gIFwiamFkZVwiLFxuICBcImlyaXNcIixcbiAgXCJydWJ5XCIsXG5dIGFzIGNvbnN0O1xuXG5cbmV4cG9ydCBjb25zdCBBTFBIQVM6IEFscGhhW10gPSBbJycsICdBJ10gYXMgY29uc3Q7XG5leHBvcnQgY29uc3QgUDNTOiBQM1tdID0gWycnLCAnUDMnXSBhcyBjb25zdDtcbmV4cG9ydCBjb25zdCBTVEVQUzogU3RlcFtdID0gWycxJywgJzInLCAnMycsICc0JywgJzUnLCAnNicsICc3JywgJzgnLCAnOScsICcxMCcsICcxMScsICcxMicsICctZmcnXSBhcyBjb25zdDtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvZmx5aW5nc2VhbC9fRHJpdmUvQ29kaW5nL3Vub2Nzcy1wcmVzZXQtcmFkaXgvc3JjXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9mbHlpbmdzZWFsL19Ecml2ZS9Db2RpbmcvdW5vY3NzLXByZXNldC1yYWRpeC9zcmMvZXh0ZW5kVGhlbWUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvZmx5aW5nc2VhbC9fRHJpdmUvQ29kaW5nL3Vub2Nzcy1wcmVzZXQtcmFkaXgvc3JjL2V4dGVuZFRoZW1lLnRzXCI7aW1wb3J0IHsgVGhlbWUgfSBmcm9tICd1bm9jc3MvcHJlc2V0LXVubyc7XG5pbXBvcnQgeyBSQURJWF9IVUVTIH0gZnJvbSAnLi9jb25zdHMnO1xuaW1wb3J0ICogYXMgYWxpYXNlc0luVXNlSGVscGVycyBmcm9tICcuL2FsaWFzZXNJblVzZUhlbHBlcnMnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBleHRlbmRUaGVtZSh7XG4gIHRoZW1lLFxuICBwcmVmaXgsXG4gIGV4dGVuZCxcbn06IHtcbiAgdGhlbWU6IFRoZW1lO1xuICBwcmVmaXg6IHN0cmluZztcbiAgZXh0ZW5kOiBib29sZWFuO1xufSkge1xuICBjb25zdCBhbGlhc2VzSW5Vc2UgPSBhbGlhc2VzSW5Vc2VIZWxwZXJzLmdldEFsaWFzZXNJblVzZSgpO1xuXG4gIHRoZW1lLmNvbG9ycyA9IHtcbiAgICAuLi4oZXh0ZW5kID8gdGhlbWU/LmNvbG9ycyA6IFtdKSxcbiAgICB0cmFuc3BhcmVudDogXCJ0cmFuc3BhcmVudFwiLFxuICAgIGN1cnJlbnQ6IFwiY3VycmVudENvbG9yXCIsXG4gICAgY3VycmVudGNvbG9yOiBcImN1cnJlbnRDb2xvclwiLFxuICAgIFwiY3VycmVudC1jb2xvclwiOiBcImN1cnJlbnRDb2xvclwiLFxuICAgIGluaGVyaXQ6IFwiaW5oZXJpdFwiLFxuXG4gICAgLi4uT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgWy4uLlJBRElYX0hVRVMsIC4uLk9iamVjdC5rZXlzKGFsaWFzZXNJblVzZSldLm1hcCgoaHVlT3JBbGlhcykgPT4ge1xuICAgICAgICBsZXQgY29sb3JzT2ZTYW1lSHVlSW5PcmlnaW5hbFRoZW1lID0ge307XG4gICAgICAgIGlmICh0aGVtZS5jb2xvcnM/LltodWVPckFsaWFzXSkge1xuICAgICAgICAgIGlmICh0eXBlb2YgdGhlbWUuY29sb3JzPy5baHVlT3JBbGlhc10gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGNvbG9yc09mU2FtZUh1ZUluT3JpZ2luYWxUaGVtZSA9IHsgREVGQVVMVDogdGhlbWUuY29sb3JzPy5baHVlT3JBbGlhc10gfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29sb3JzT2ZTYW1lSHVlSW5PcmlnaW5hbFRoZW1lID0gdGhlbWUuY29sb3JzPy5baHVlT3JBbGlhc107XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgaHVlT3JBbGlhcyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgLi4uKGV4dGVuZCA/IGNvbG9yc09mU2FtZUh1ZUluT3JpZ2luYWxUaGVtZSA6IHt9KSxcblxuICAgICAgICAgICAgICBcImZnXCI6IGB2YXIoLS0ke3ByZWZpeH0tJHtodWVPckFsaWFzfS1mZylgLFxuXG4gICAgICAgICAgICAgIFwiMVwiOiBgdmFyKC0tJHtwcmVmaXh9LSR7aHVlT3JBbGlhc30xKWAsXG4gICAgICAgICAgICAgIFwiMlwiOiBgdmFyKC0tJHtwcmVmaXh9LSR7aHVlT3JBbGlhc30yKWAsXG4gICAgICAgICAgICAgIFwiM1wiOiBgdmFyKC0tJHtwcmVmaXh9LSR7aHVlT3JBbGlhc30zKWAsXG4gICAgICAgICAgICAgIFwiNFwiOiBgdmFyKC0tJHtwcmVmaXh9LSR7aHVlT3JBbGlhc300KWAsXG4gICAgICAgICAgICAgIFwiNVwiOiBgdmFyKC0tJHtwcmVmaXh9LSR7aHVlT3JBbGlhc301KWAsXG4gICAgICAgICAgICAgIFwiNlwiOiBgdmFyKC0tJHtwcmVmaXh9LSR7aHVlT3JBbGlhc302KWAsXG4gICAgICAgICAgICAgIFwiN1wiOiBgdmFyKC0tJHtwcmVmaXh9LSR7aHVlT3JBbGlhc303KWAsXG4gICAgICAgICAgICAgIFwiOFwiOiBgdmFyKC0tJHtwcmVmaXh9LSR7aHVlT3JBbGlhc304KWAsXG4gICAgICAgICAgICAgIFwiOVwiOiBgdmFyKC0tJHtwcmVmaXh9LSR7aHVlT3JBbGlhc305KWAsXG4gICAgICAgICAgICAgIFwiMTBcIjogYHZhcigtLSR7cHJlZml4fS0ke2h1ZU9yQWxpYXN9MTApYCxcbiAgICAgICAgICAgICAgXCIxMVwiOiBgdmFyKC0tJHtwcmVmaXh9LSR7aHVlT3JBbGlhc30xMSlgLFxuICAgICAgICAgICAgICBcIjEyXCI6IGB2YXIoLS0ke3ByZWZpeH0tJHtodWVPckFsaWFzfTEyKWAsXG5cbiAgICAgICAgICAgICAgLy8gcHV0IGNvbG9ycyB3aXRoIGFscGhhIHZhbHVlcyBpbnNpZGUgdmFyKC4uLikgc28sIHVub2NzcyBkb24ndCBhZGQgZXh0cmEgb3BhY2l0eSBhbmQgYnJlYWsgaXQuXG4gICAgICAgICAgICAgIFwiMUFcIjogYHZhcigtLSR7cHJlZml4fS0ke2h1ZU9yQWxpYXN9MUEpYCxcbiAgICAgICAgICAgICAgXCIyQVwiOiBgdmFyKC0tJHtwcmVmaXh9LSR7aHVlT3JBbGlhc30yQSlgLFxuICAgICAgICAgICAgICBcIjNBXCI6IGB2YXIoLS0ke3ByZWZpeH0tJHtodWVPckFsaWFzfTNBKWAsXG4gICAgICAgICAgICAgIFwiNEFcIjogYHZhcigtLSR7cHJlZml4fS0ke2h1ZU9yQWxpYXN9NEEpYCxcbiAgICAgICAgICAgICAgXCI1QVwiOiBgdmFyKC0tJHtwcmVmaXh9LSR7aHVlT3JBbGlhc301QSlgLFxuICAgICAgICAgICAgICBcIjZBXCI6IGB2YXIoLS0ke3ByZWZpeH0tJHtodWVPckFsaWFzfTZBKWAsXG4gICAgICAgICAgICAgIFwiN0FcIjogYHZhcigtLSR7cHJlZml4fS0ke2h1ZU9yQWxpYXN9N0EpYCxcbiAgICAgICAgICAgICAgXCI4QVwiOiBgdmFyKC0tJHtwcmVmaXh9LSR7aHVlT3JBbGlhc304QSlgLFxuICAgICAgICAgICAgICBcIjlBXCI6IGB2YXIoLS0ke3ByZWZpeH0tJHtodWVPckFsaWFzfTlBKWAsXG4gICAgICAgICAgICAgIFwiMTBBXCI6IGB2YXIoLS0ke3ByZWZpeH0tJHtodWVPckFsaWFzfTEwQSlgLFxuICAgICAgICAgICAgICBcIjExQVwiOiBgdmFyKC0tJHtwcmVmaXh9LSR7aHVlT3JBbGlhc30xMUEpYCxcbiAgICAgICAgICAgICAgXCIxMkFcIjogYHZhcigtLSR7cHJlZml4fS0ke2h1ZU9yQWxpYXN9MTJBKWAsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdO1xuICAgICAgfSlcbiAgICApLFxuICAgIHdoaXRlOiB7XG4gICAgICAvLyBpZiB1c2VyIGhhcyBkZWZpbmQgc29tZSB2YXJpYXRpb24gZm9yIHdoaXRlICh3aGl0ZS00MDAgb3Igd2hpdGUtd2FybSlcbiAgICAgIC4uLihleHRlbmQgJiYgdHlwZW9mIHRoZW1lPy5jb2xvcnM/LltcIndoaXRlXCJdICE9PSBcInN0cmluZ1wiID8gdGhlbWU/LmNvbG9ycz8uW1wid2hpdGVcIl0gOiB7fSksXG4gICAgICBERUZBVUxUOiBcIiNmZmZmZmZcIixcblxuICAgICAgZmc6ICdibGFjaycsXG5cbiAgICAgIFwiMUFcIjogYHZhcigtLSR7cHJlZml4fS13aGl0ZTFBKWAsXG4gICAgICBcIjJBXCI6IGB2YXIoLS0ke3ByZWZpeH0td2hpdGUyQSlgLFxuICAgICAgXCIzQVwiOiBgdmFyKC0tJHtwcmVmaXh9LXdoaXRlM0EpYCxcbiAgICAgIFwiNEFcIjogYHZhcigtLSR7cHJlZml4fS13aGl0ZTRBKWAsXG4gICAgICBcIjVBXCI6IGB2YXIoLS0ke3ByZWZpeH0td2hpdGU1QSlgLFxuICAgICAgXCI2QVwiOiBgdmFyKC0tJHtwcmVmaXh9LXdoaXRlNkEpYCxcbiAgICAgIFwiN0FcIjogYHZhcigtLSR7cHJlZml4fS13aGl0ZTdBKWAsXG4gICAgICBcIjhBXCI6IGB2YXIoLS0ke3ByZWZpeH0td2hpdGU4QSlgLFxuICAgICAgXCI5QVwiOiBgdmFyKC0tJHtwcmVmaXh9LXdoaXRlOUEpYCxcbiAgICAgIFwiMTBBXCI6IGB2YXIoLS0ke3ByZWZpeH0td2hpdGUxMEEpYCxcbiAgICAgIFwiMTFBXCI6IGB2YXIoLS0ke3ByZWZpeH0td2hpdGUxMUEpYCxcbiAgICAgIFwiMTJBXCI6IGB2YXIoLS0ke3ByZWZpeH0td2hpdGUxMkEpYCxcbiAgICB9LFxuICAgIGJsYWNrOiB7XG4gICAgICAuLi4oZXh0ZW5kICYmIHR5cGVvZiB0aGVtZT8uY29sb3JzPy5bXCJ3aGl0ZVwiXSAhPT0gXCJzdHJpbmdcIiA/IHRoZW1lPy5jb2xvcnM/LltcIndoaXRlXCJdIDoge30pLFxuICAgICAgREVGQVVMVDogXCIjMDAwMDAwXCIsXG5cbiAgICAgIGZnOiAnd2hpdGUnLFxuXG4gICAgICBcIjFBXCI6IGB2YXIoLS0ke3ByZWZpeH0tYmxhY2sxQSlgLFxuICAgICAgXCIyQVwiOiBgdmFyKC0tJHtwcmVmaXh9LWJsYWNrMkEpYCxcbiAgICAgIFwiM0FcIjogYHZhcigtLSR7cHJlZml4fS1ibGFjazNBKWAsXG4gICAgICBcIjRBXCI6IGB2YXIoLS0ke3ByZWZpeH0tYmxhY2s0QSlgLFxuICAgICAgXCI1QVwiOiBgdmFyKC0tJHtwcmVmaXh9LWJsYWNrNUEpYCxcbiAgICAgIFwiNkFcIjogYHZhcigtLSR7cHJlZml4fS1ibGFjazZBKWAsXG4gICAgICBcIjdBXCI6IGB2YXIoLS0ke3ByZWZpeH0tYmxhY2s3QSlgLFxuICAgICAgXCI4QVwiOiBgdmFyKC0tJHtwcmVmaXh9LWJsYWNrOEEpYCxcbiAgICAgIFwiOUFcIjogYHZhcigtLSR7cHJlZml4fS1ibGFjazlBKWAsXG4gICAgICBcIjEwQVwiOiBgdmFyKC0tJHtwcmVmaXh9LWJsYWNrMTBBKWAsXG4gICAgICBcIjExQVwiOiBgdmFyKC0tJHtwcmVmaXh9LWJsYWNrMTFBKWAsXG4gICAgICBcIjEyQVwiOiBgdmFyKC0tJHtwcmVmaXh9LWJsYWNrMTJBKWAsXG4gICAgfSxcbiAgfSBhcyBUaGVtZVtcImNvbG9yc1wiXTtcbn1cblxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9mbHlpbmdzZWFsL19Ecml2ZS9Db2RpbmcvdW5vY3NzLXByZXNldC1yYWRpeC9zcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2ZseWluZ3NlYWwvX0RyaXZlL0NvZGluZy91bm9jc3MtcHJlc2V0LXJhZGl4L3NyYy92YWxpZGF0aW9uLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2ZseWluZ3NlYWwvX0RyaXZlL0NvZGluZy91bm9jc3MtcHJlc2V0LXJhZGl4L3NyYy92YWxpZGF0aW9uLnRzXCI7aW1wb3J0IHsgQUxQSEFTLCBSQURJWF9IVUVTLCBTVEVQUyB9IGZyb20gJy4vY29uc3RzJztcbmltcG9ydCB7IEFsaWFzZXMsIEFscGhhLCBSYWRpeEh1ZSwgIFN0ZXAgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCAqIGFzIGFsaWFzZXNJblVzZUhlbHBlcnMgZnJvbSAnLi9hbGlhc2VzSW5Vc2VIZWxwZXJzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRQcmVmaXgocHJlZml4OiBhbnkpeyBcbiAgaWYgKHR5cGVvZiBwcmVmaXggIT09IFwic3RyaW5nXCIpIHJldHVybiBmYWxzZTtcbiAgaWYgKCFwcmVmaXgubWF0Y2goL15bYS16QS1aMC05LV9dKyQvKSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRBbGlhc05hbWUoYWxpYXNOYW1lOiBzdHJpbmcpIHtcbiAgaWYgKHR5cGVvZiBhbGlhc05hbWUgIT09ICdzdHJpbmcnKSByZXR1cm4gZmFsc2VcbiAgaWYgKFsnd2hpdGUnLCAnYmxhY2snLCAuLi5SQURJWF9IVUVTXS5pbmNsdWRlcyhhbGlhc05hbWUpKSByZXR1cm4gZmFsc2U7XG4gIGlmICghYWxpYXNOYW1lLm1hdGNoKC9eW2Etel0rKC1bYS16XSspKiQvKSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRSYWRpeEh1ZShodWU6IHN0cmluZykge1xuICAvLyBAdHMtaWdub3JlXG4gIHJldHVybiBSQURJWF9IVUVTLmluY2x1ZGVzKGh1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkQ29sb3IoeyBodWUsIHN0ZXAsIGFscGhhIH06IHsgaHVlOiBzdHJpbmc7IHN0ZXA6IFN0ZXA7IGFscGhhOiBBbHBoYSB9KSB7XG4gIGlmICghaXNWYWxpZFJhZGl4SHVlKGh1ZSkgJiYgIVsnYmxhY2snLCAnd2hpdGUnXS5pbmNsdWRlcyhodWUpKSByZXR1cm4gZmFsc2U7XG4gIGlmIChzdGVwID09PSAnLWZnJyAmJiBhbHBoYSA9PT0gJ0EnKSByZXR1cm4gZmFsc2U7XG4gIGlmIChbJ2JsYWNrJywgJ3doaXRlJ10uaW5jbHVkZXMoaHVlKSAmJiBhbHBoYSA9PT0gJycgJiYgc3RlcCAhPT0gJy1mZycpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkQWxpYXMoe1xuICBhbGlhcyxcbiAgc3RlcCxcbiAgYWxwaGEsXG4gIGFsaWFzZXMsXG59OiB7XG4gIGFsaWFzOiBzdHJpbmc7XG4gIHN0ZXA6IFN0ZXA7XG4gIGFscGhhOiBBbHBoYTtcbiAgYWxpYXNlczogQWxpYXNlcztcbn0pIHtcbiAgY29uc3QgYWxpYXNlc0luVXNlID0gYWxpYXNlc0luVXNlSGVscGVycy5nZXRBbGlhc2VzSW5Vc2UoKTtcbiAgXG4gIGlmICghaXNWYWxpZEFsaWFzTmFtZShhbGlhcykpIHJldHVybiBmYWxzZTtcbiAgaWYgKCEoYWxpYXMgaW4gZmlsdGVyVmFsaWRBbGlhc2VzKGFsaWFzZXMpKSAmJiAhKGFsaWFzIGluIGFsaWFzZXNJblVzZSkpIHJldHVybiBmYWxzZTtcbiAgaWYgKHN0ZXAgPT09ICctZmcnICYmIGFscGhhID09PSAnQScpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJWYWxpZEFsaWFzZXMoYWxpYXNlczogQWxpYXNlcykge1xuICBjb25zdCB2YWxpZEFsaWFzZXM6IEFsaWFzZXMgPSB7fTtcbiAgZm9yIChjb25zdCBhbGlhcyBpbiBhbGlhc2VzKSB7XG4gICAgY29uc3QgaHVlID0gYWxpYXNlc1thbGlhc107XG4gICAgaWYgKGlzVmFsaWRBbGlhc05hbWUoYWxpYXMpICYmIGlzVmFsaWRSYWRpeEh1ZShodWUpKSB2YWxpZEFsaWFzZXNbYWxpYXNdID0gaHVlO1xuICB9XG4gIHJldHVybiB2YWxpZEFsaWFzZXM7XG59XG5cbnR5cGUgUmFkaXhDb2xvclByb3BlcnRpZXMgPSB7IGh1ZTogUmFkaXhIdWUgfCAnYmxhY2snIHwgJ3doaXRlJzsgc3RlcDogU3RlcCB8ICctZmcnOyBhbHBoYTogQWxwaGEgfTtcblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlclZhbGlkU2FmZWxpc3RDb2xvcnMoc2FmZWxpc3RDb2xvcnM6IHN0cmluZ1tdKSB7XG4gIGNvbnN0IHZhbGlkU2FmZWxpc3RDb2xvcnMgPSB7fSBhcyBSZWNvcmQ8c3RyaW5nLCBSYWRpeENvbG9yUHJvcGVydGllcz47XG4gIGZvciAoY29uc3Qgc2FmZWxpc3RDb2xvciBvZiBzYWZlbGlzdENvbG9ycykge1xuICAgIGNvbnN0IG1hdGNoID0gc2FmZWxpc3RDb2xvci5tYXRjaCgvXihbYS16XSspKDF8MnwzfDR8NXw2fDd8OHw5fDEwfDExfDEyfC1mZyk/KEEpPyQvKTtcbiAgICBpZiAoIW1hdGNoKSBjb250aW51ZTtcbiAgICBjb25zdCBbdG9rZW4sIGh1ZSwgc3RlcCA9ICcnLCBhbHBoYSA9ICcnXSA9IG1hdGNoIGFzIFtzdHJpbmcsIFJhZGl4SHVlIHwgJ2JsYWNrJyB8ICd3aGl0ZScsIFN0ZXAgfCAnJywgQWxwaGFdO1xuXG4gICAgLy8gaWYgaXRzIGEgc2luZ2xlIHN0ZXBcbiAgICBpZiAoc3RlcCkge1xuICAgICAgaWYgKCFpc1ZhbGlkQ29sb3IoeyBodWUsIHN0ZXAsIGFscGhhIH0pKSBjb250aW51ZTtcbiAgICAgIHZhbGlkU2FmZWxpc3RDb2xvcnNbYCR7aHVlfSR7c3RlcH0ke2FscGhhfWBdID0geyBodWUsIHN0ZXAsIGFscGhhIH07XG4gICAgfVxuICAgIGlmICghc3RlcCkge1xuICAgICAgZm9yIChjb25zdCBhIG9mIEFMUEhBUykge1xuICAgICAgICBmb3IgKGNvbnN0IHNoIG9mIFNURVBTKSB7XG4gICAgICAgICAgaWYgKCFpc1ZhbGlkQ29sb3IoeyBodWUsIHN0ZXA6IHNoLCBhbHBoYTogYSB9KSkgY29udGludWU7XG4gICAgICAgICAgdmFsaWRTYWZlbGlzdENvbG9yc1tgJHtodWV9JHtzaH0ke2F9YF0gPSB7IGh1ZSwgc3RlcDogc2gsIGFscGhhOiBhIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbGlkU2FmZWxpc3RDb2xvcnM7XG59XG5cbmV4cG9ydCB0eXBlIFJhZGl4QWxpYXNQcm9wZXJ0aWVzID0geyBhbGlhczogc3RyaW5nOyBzdGVwOiBTdGVwIHwgJy1mZyc7IGFscGhhOiBBbHBoYSB9O1xuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyVmFsaWRTYWZlbGlzdEFsaWFzZXMoc2FmZWxpc3RBbGlhc2VzOiBzdHJpbmdbXSwgYWxpYXNlczogQWxpYXNlcykge1xuICBjb25zdCB2YWxpZFNhZmVsaXN0QWxpYXNlcyA9IHt9IGFzIFJlY29yZDxzdHJpbmcsIFJhZGl4QWxpYXNQcm9wZXJ0aWVzPjtcblxuICBmb3IgKGNvbnN0IHNhZmVsaXN0QWxpYXMgb2Ygc2FmZWxpc3RBbGlhc2VzKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzYWZlbGlzdEFsaWFzLm1hdGNoKC9eKFthLXpdKygtW2Etel0rKSopKDF8MnwzfDR8NXw2fDd8OHw5fDEwfDExfDEyfC1mZyk/KEEpPyQvKTtcbiAgICBpZiAoIW1hdGNoKSBjb250aW51ZTtcblxuICAgIGNvbnN0IFt0b2tlbiwgYWxpYXMsIGFsaWFzSW5uZXJHcm91cCAsIHN0ZXAgPSAnJywgYWxwaGEgPSAnJ10gPSBtYXRjaCBhcyBbc3RyaW5nLCBzdHJpbmcgLHN0cmluZywgU3RlcCB8ICcnLCBBbHBoYV07XG5cbiAgICBpZiAoc3RlcCkge1xuICAgICAgaWYgKCFpc1ZhbGlkQWxpYXMoeyBhbGlhcywgc3RlcCwgYWxwaGEsIGFsaWFzZXMgfSkpIGNvbnRpbnVlO1xuICAgICAgdmFsaWRTYWZlbGlzdEFsaWFzZXNbYCR7YWxpYXN9JHtzdGVwfSR7YWxwaGF9YF0gPSB7IGFsaWFzLCBzdGVwLCBhbHBoYSB9O1xuICAgIH1cbiAgICBpZiAoIXN0ZXApIHtcbiAgICAgIGZvciAoY29uc3QgYSBvZiBBTFBIQVMpIHtcbiAgICAgICAgZm9yIChjb25zdCBzaCBvZiBTVEVQUykge1xuICAgICAgICAgIGlmICghaXNWYWxpZEFsaWFzKHsgYWxpYXMsIHN0ZXA6IHNoLCBhbHBoYTogYSwgYWxpYXNlcyB9KSkgY29udGludWU7XG4gICAgICAgICAgdmFsaWRTYWZlbGlzdEFsaWFzZXNbYCR7YWxpYXN9JHtzaH0ke2F9YF0gPSB7IGFsaWFzLCBzdGVwOiBzaCwgYWxwaGE6IGEgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdmFsaWRTYWZlbGlzdEFsaWFzZXM7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2ZseWluZ3NlYWwvX0RyaXZlL0NvZGluZy91bm9jc3MtcHJlc2V0LXJhZGl4L3NyY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvZmx5aW5nc2VhbC9fRHJpdmUvQ29kaW5nL3Vub2Nzcy1wcmVzZXQtcmFkaXgvc3JjL2luZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2ZseWluZ3NlYWwvX0RyaXZlL0NvZGluZy91bm9jc3MtcHJlc2V0LXJhZGl4L3NyYy9pbmRleC50c1wiO2ltcG9ydCB7IFByZXNldCB9IGZyb20gJ3Vub2Nzcyc7XG5pbXBvcnQgdHlwZSB7IFRoZW1lIH0gZnJvbSAndW5vY3NzL3ByZXNldC11bm8nO1xuaW1wb3J0IHsgdHlwZSBPcHRpb25zLCBBbGlhc2VzLCBBbHBoYSwgSHVlT3JBbGlhcywgUHJvcGVydHksIFJhZGl4SHVlLCBTdGVwIH0gZnJvbSAnLi90eXBlcyc7XG5cbmltcG9ydCB7IGdlbmVyYXRlQ1NTVmFyaWFibGVzRm9yQ29sb3JzSW5Vc2UgfSBmcm9tICcuL3ByZWZsaWdodHMnO1xuaW1wb3J0IHsgZXh0ZW5kVGhlbWUgfSBmcm9tICcuL2V4dGVuZFRoZW1lJztcbmltcG9ydCAqIGFzIGNvbG9yc0luVXNlSGVscGVycyBmcm9tICcuL2NvbG9yc0luVXNlSGVscGVycyc7XG5pbXBvcnQgKiBhcyBhbGlhc2VzSW5Vc2VIZWxwZXJzIGZyb20gJy4vYWxpYXNlc0luVXNlSGVscGVycyc7XG5pbXBvcnQge1xuICBmaWx0ZXJWYWxpZEFsaWFzZXMsXG4gIGZpbHRlclZhbGlkU2FmZWxpc3RBbGlhc2VzLFxuICBmaWx0ZXJWYWxpZFNhZmVsaXN0Q29sb3JzLFxuICBpc1ZhbGlkQWxpYXMsXG4gIGlzVmFsaWRBbGlhc05hbWUsXG4gIGlzVmFsaWRDb2xvcixcbiAgaXNWYWxpZFByZWZpeCxcbiAgaXNWYWxpZFJhZGl4SHVlLFxufSBmcm9tICcuL3ZhbGlkYXRpb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gcHJlc2V0UmFkaXg8VCBleHRlbmRzIEFsaWFzZXM+KHtcbiAgdXNlUDNDb2xvcnMgPSBmYWxzZSxcbiAgcHJlZml4OiBfcHJlZml4ID0gJy0tdW4tcHJlc2V0LXJhZGl4LScsXG4gIGRhcmtTZWxlY3RvciA9ICcuZGFyay10aGVtZScsXG4gIGxpZ2h0U2VsZWN0b3IgPSAnOnJvb3QsIC5saWdodC10aGVtZScsXG4gIGFsaWFzZXM6IF9hbGlhc2VzLFxuICBzYWZlbGlzdCxcbiAgZXh0ZW5kID0gZmFsc2UsXG4gIG9ubHlPbmVUaGVtZSxcbiAgbGF5ZXIsXG59OiBPcHRpb25zPFQ+KTogUHJlc2V0PFRoZW1lPiB7XG4gIGxldCBwcmVmaXggPSBpc1ZhbGlkUHJlZml4KF9wcmVmaXgpID8gX3ByZWZpeCA6ICctLXVuLXByZXNldC1yYWRpeC0nO1xuICAvLyByZW1vdmUgaHlwaGVucyBmcm9tIHN0YXJ0IGFuZCBlbmQgb2YgcHJlZml4LlxuICBwcmVmaXggPSBwcmVmaXgucmVwbGFjZUFsbCgnLScsICcgJykudHJpbSgpLnJlcGxhY2VBbGwoJyAnLCAnLScpO1xuXG4gIC8vIGZpbHRlciB2YWxpZCB1c2VyIGlucHV0cyArIGZsYXR0ZW4gdGhlbSAoYmx1ZSAtPiBibHVlMSwgYmx1ZTIsIC4uLiwgYmx1ZTEyLC4uLiAsIGJsdWUxMkEsIGJsdWUtZmcpXG4gIGNvbnN0IHNhZmVsaXN0Q29sb3JzID0gZmlsdGVyVmFsaWRTYWZlbGlzdENvbG9ycygoc2FmZWxpc3QgPz8gW10pIGFzIHN0cmluZ1tdKTtcbiAgY29uc3QgYWxpYXNlcyA9IGZpbHRlclZhbGlkQWxpYXNlcyhfYWxpYXNlcyA/PyB7fSk7XG4gIGNvbnN0IHNhZmVsaXN0QWxpYXNlcyA9IGZpbHRlclZhbGlkU2FmZWxpc3RBbGlhc2VzKChzYWZlbGlzdCA/PyBbXSkgYXMgc3RyaW5nW10sIGFsaWFzZXMpO1xuXG4gIC8vIGFkZCBzYWZlbGlzdCBjb2xvcnMgdG8gY29sb3JzIGluIHVzZVxuICBmb3IgKGNvbnN0IHNhZmVsaXN0Q29sb3IgaW4gc2FmZWxpc3RDb2xvcnMpIHtcbiAgICBjb25zdCB7IGh1ZSwgc3RlcCwgYWxwaGEgfSA9IHNhZmVsaXN0Q29sb3JzW3NhZmVsaXN0Q29sb3JdO1xuICAgIGNvbG9yc0luVXNlSGVscGVycy5hZGRDb2xvcih7IGh1ZSwgc3RlcCwgYWxwaGEgfSk7XG4gIH1cblxuICAvLyBhZGQgc2FmZWxpc3QgYWxpYXNlcyB0byBhbGlhc2VzIGluIHVzZSArIGFkZCByZXNwZWN0aXZlIGh1ZSB0byBBbGlhc2VzSW5Vc2VcbiAgZm9yIChjb25zdCBzYWZlbGlzdEFsaWFzIGluIHNhZmVsaXN0QWxpYXNlcykge1xuICAgIGNvbnN0IHsgYWxpYXMsIHN0ZXAsIGFscGhhIH0gPSBzYWZlbGlzdEFsaWFzZXNbc2FmZWxpc3RBbGlhc107XG4gICAgY29uc3QgaHVlID0gYWxpYXNlc1thbGlhc107XG5cbiAgICBhbGlhc2VzSW5Vc2VIZWxwZXJzLmFkZFBvc3NpYmxlSHVlVG9BbkFsaWFzKHsgYWxpYXMsIHBvc3NpYmxlSHVlOiBodWUgfSk7XG4gICAgYWxpYXNlc0luVXNlSGVscGVycy5hZGRTdGVwVG9BbkFsaWFzKHsgYWxpYXMsIHN0ZXAsIGFscGhhIH0pO1xuICB9XG5cbiAgLy8gYWxzbyBhZGQgdGhlIGNvbG9yIHJpZ2h0IGF3YXkgd2hldGhlciBpdCBpcyB1c2VkIGluIHByb2plY3Qgb3Igbm90LlxuICBmb3IgKGNvbnN0IHNhZmVsaXN0QWxpYXMgaW4gc2FmZWxpc3RBbGlhc2VzKSB7XG4gICAgY29uc3QgeyBhbGlhcywgc3RlcCwgYWxwaGEgfSA9IHNhZmVsaXN0QWxpYXNlc1tzYWZlbGlzdEFsaWFzXTtcbiAgICAvLyBjb2xvcnNJblVzZUhlbHBlcnMuYWRkQWxsUG9zc2libGVDb2xvcnNPZkFuQWxpYXMoeyBhbGlhcyB9KTtcbiAgfVxuXG4gIC8vIGFkZCBhIHBvc3NpYmxlIGh1ZSBmb3Igb3RoZXIgYWxpYXNcbiAgLy8gZG9uJ3QgYWRkIGFueSBjb2xvciByaWdodCBhd2F5LiBDb2xvcnMgYXJlIGFkZGVkIHdoZW4gYWxpYXMgdXNhZ2UgaXMgZGV0ZWN0ZWRcbiAgZm9yIChjb25zdCBhbGlhcyBpbiBhbGlhc2VzKSB7XG4gICAgYWxpYXNlc0luVXNlSGVscGVycy5hZGRQb3NzaWJsZUh1ZVRvQW5BbGlhcyh7IGFsaWFzLCBwb3NzaWJsZUh1ZTogYWxpYXNlc1thbGlhc10gfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICd1bm9jc3MtcHJlc2V0LXJhZGl4JyxcbiAgICBsYXllcnM6IGxheWVyID8ge1xuICAgICAgcHJlZmxpZ2h0czogMSxcbiAgICAgIFtsYXllcl06IDIsXG4gICAgICBkZWZhdWx0OiAzLFxuICAgIH0gOiB1bmRlZmluZWQsXG4gICAgc2hvcnRjdXRzOiBbXG4gICAgICAvLyBUaGlzIHNob3J0Y3V0IGV4aXN0IHNvIGdlbmVyYXRlZCBjc3MgZm9yIGNvbG9ycyB0byBoYXZlIHNhbWUgb3JkZXIuXG4gICAgICBbL14oLiopLSh0cmFuc3BhcmVudHx3aGl0ZXxibGFja3xjdXJyZW50fGN1cnJlbnQtY29sb3J8aW5oZXJpdCkkLywgKFt0b2tlbl0pID0+IGAke3Rva2VufWAsIHsgbGF5ZXI6ICdkZWZhdWx0JyB9XSxcbiAgICAgIC8vIERldGVjdCB1c2FnZSBvZiByYWRpeCBjb2xvcnMgb3IgYWxpYXNlcyBhbmQgaGFuZGxlIGl0IChieSBhZGRpbmcgdG8gY29sb3JzIGluIHVzZSkuIFByZWZsaWdodCB3aWxsIGdlbmVyYXRlIGNzcyB2YXJpYWJsZXMgZm9yIGJhc2VkIG9mZiBjb2xvcnNJblVzZSBhbmQgYWxpYXNlc0luVXNlLlxuICAgICAgW1xuICAgICAgICAvXihbYS16XSsoLVthLXpdKykqKS0oW2Etel0rKSgxfDJ8M3w0fDV8Nnw3fDh8OXwxMHwxMXwxMnwtZmcpKEEpPyQvLFxuICAgICAgICAobWF0Y2gpID0+IHtcbiAgICAgICAgICBpZiAoIW1hdGNoKSByZXR1cm47XG4gICAgICAgICAgY29uc3QgW3Rva2VuLCBwcm9wZXJ0eSwgcHJvcGVydHlJbm5lckdyb3VwLCBodWVPckFsaWFzLCBzdGVwLCBhbHBoYSA9ICcnXSA9IG1hdGNoIGFzIFtcbiAgICAgICAgICAgIHN0cmluZyxcbiAgICAgICAgICAgIHN0cmluZyxcbiAgICAgICAgICAgIHN0cmluZyxcbiAgICAgICAgICAgIEh1ZU9yQWxpYXMsXG4gICAgICAgICAgICBTdGVwLFxuICAgICAgICAgICAgQWxwaGFcbiAgICAgICAgICBdO1xuXG4gICAgICAgICAgaWYgKGlzVmFsaWRDb2xvcih7IGh1ZTogaHVlT3JBbGlhcywgc3RlcCwgYWxwaGEgfSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGh1ZSA9IGh1ZU9yQWxpYXMgYXMgUmFkaXhIdWUgfCAnd2hpdGUnIHwgJ2JsYWNrJztcbiAgICAgICAgICAgIGNvbG9yc0luVXNlSGVscGVycy5hZGRDb2xvcih7IGh1ZSwgc3RlcCwgYWxwaGEgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiXHVEODNEXHVERTgwIH4gaXNWYWxpZEFsaWFzKHsgYWxpYXM6IGh1ZU9yQWxpYXMsIHN0ZXAsIGFscGhhLCBhbGlhc2VzIH0pOlwiLCBpc1ZhbGlkQWxpYXMoeyBhbGlhczogaHVlT3JBbGlhcywgc3RlcCwgYWxwaGEsIGFsaWFzZXMgfSkpXG5cbiAgICAgICAgICBpZiAoaXNWYWxpZEFsaWFzKHsgYWxpYXM6IGh1ZU9yQWxpYXMsIHN0ZXAsIGFscGhhLCBhbGlhc2VzIH0pKSB7XG4gICAgICAgICAgICBjb25zdCBhbGlhcyA9IGh1ZU9yQWxpYXM7XG4gICAgICAgICAgICBhbGlhc2VzSW5Vc2VIZWxwZXJzLmFkZFN0ZXBUb0FuQWxpYXMoeyBhbGlhcywgc3RlcCwgYWxwaGEgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICB9LFxuICAgICAgICB7IGxheWVyOiAnZGVmYXVsdCcgfSxcbiAgICAgIF0sXG4gICAgICAvLyBkZXRlY3QgdXNhZ2Ugb2YgZHluYW1pYyBhbGlhc2luZyBhbmQgaGFuZGxlIGl0LlxuICAgICAgLy8gdXNpbmcgdW5vY3NzIHNob3J0Y3V0IGluc3RlYWQgb2YgcnVsZSBzaW5jZSBzaG9ydGN1dCBydW5zIGVhcmxpZXIuIFNvIHdlIGFyZSBhd2FyZSBvZiBhbGwgZHluYW1pYyBhbGlhc2luZyB1c2FnZSBiZWZvcmUgcHJvY2Vzc2luZyBhbGlhcyB1c2FnZXNcbiAgICAgIC8vIGV4YW1wbGU6IGFsaWFzLXdhcm5pbmctYW1iZXJcbiAgICAgIFtcbiAgICAgICAgL15hbGlhcy0oW2Etel0rKC1bYS16XSspKiktKFthLXpdKykkLyxcbiAgICAgICAgKG1hdGNoKSA9PiB7XG4gICAgICAgICAgaWYgKCFtYXRjaCkgcmV0dXJuO1xuICAgICAgICAgIGNvbnN0IFt0b2tlbiwgYWxpYXMsIGFsaWFzSW5uZXJHcm91cCwgaHVlXSA9IG1hdGNoIGFzIFtzdHJpbmcsIHN0cmluZywgc3RyaW5nLCBSYWRpeEh1ZV07XG4gICAgICAgICAgaWYgKCFpc1ZhbGlkUmFkaXhIdWUoaHVlKSkgcmV0dXJuICcnO1xuICAgICAgICAgIGlmICghaXNWYWxpZEFsaWFzTmFtZShhbGlhcykpIHJldHVybiAnJztcbiAgICAgICAgICBhbGlhc2VzSW5Vc2VIZWxwZXJzLmFkZFBvc3NpYmxlSHVlVG9BbkFsaWFzKHsgYWxpYXMsIHBvc3NpYmxlSHVlOiBodWUgfSk7XG4gICAgICAgICAgYWxpYXNlc0luVXNlSGVscGVycy5hZGRTY29wZSh7IGFsaWFzLCBzZWxlY3RvcjogYC4ke3Rva2VufWAsIGh1ZSB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0sXG4gICAgICAgIHsgbGF5ZXI6ICdkZWZhdWx0JyB9LFxuICAgICAgXSxcbiAgICBdLFxuXG4gICAgcnVsZXM6IFtcbiAgICAgIC8vIGRldGVjdCB1c2FnZSBvZiByYWRpeCBjb2xvcnMgb3IgYWxpYXNlcyBhcyBjc3MgdmFyaWFibGVzIGFuZCBoYW5kbGUgaXQuXG4gICAgICAvLyBleGFtcGxlczogdmFyKC0tdW4tcHJlc2V0LXJhZGl4LXBpbms5KSwgdmFyKC0tdW4tcHJlc2V0LXJhZGl4LXdhcm5pbmc5QSApLCB2YXIoLS11bm8tcHJlc2V0LXJhZGl4LWRhbmdlci1mZywgd2hpdGUpXG4gICAgICBbXG4gICAgICAgIC9edmFyXFwoLS0oW0EtWmEtejAtOVxcLVxcX10rKS0oW2Etel0rKSgxfDJ8M3w0fDV8Nnw3fDh8OXwxMHwxMXwxMnwtZmcpKEEpPyhcXCl8LCk/JC8sXG4gICAgICAgIChtYXRjaCkgPT4ge1xuICAgICAgICAgIGlmICghbWF0Y2gpIHJldHVybjtcbiAgICAgICAgICBjb25zdCBbdG9rZW4sIG1hdGNoZWRQcmVmaXgsIGh1ZU9yQWxpYXMsIHN0ZXAsIGFscGhhID0gJycsIGNsb3NpbmdCcmFja2V0T3JDb21tYV0gPSBtYXRjaCBhcyBbXG4gICAgICAgICAgICBzdHJpbmcsXG4gICAgICAgICAgICBzdHJpbmcsXG4gICAgICAgICAgICBIdWVPckFsaWFzLFxuICAgICAgICAgICAgU3RlcCxcbiAgICAgICAgICAgIEFscGhhLFxuICAgICAgICAgICAgc3RyaW5nXG4gICAgICAgICAgXTtcbiAgICAgICAgICBpZiAobWF0Y2hlZFByZWZpeCAhPT0gcHJlZml4KSByZXR1cm47XG5cbiAgICAgICAgICBpZiAoaXNWYWxpZENvbG9yKHsgaHVlOiBodWVPckFsaWFzLCBzdGVwLCBhbHBoYSB9KSkge1xuICAgICAgICAgICAgY29uc3QgaHVlID0gaHVlT3JBbGlhcyBhcyBSYWRpeEh1ZSB8ICd3aGl0ZScgfCAnYmxhY2snO1xuICAgICAgICAgICAgY29sb3JzSW5Vc2VIZWxwZXJzLmFkZENvbG9yKHsgaHVlLCBzdGVwLCBhbHBoYSB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaXNWYWxpZEFsaWFzKHsgYWxpYXM6IGh1ZU9yQWxpYXMsIHN0ZXAsIGFscGhhLCBhbGlhc2VzIH0pKSB7XG4gICAgICAgICAgICBjb25zdCBhbGlhcyA9IGh1ZU9yQWxpYXM7XG4gICAgICAgICAgICBhbGlhc2VzSW5Vc2VIZWxwZXJzLmFkZFN0ZXBUb0FuQWxpYXMoeyBhbGlhcywgc3RlcCwgYWxwaGEgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAnJ1xuICAgICAgICB9LFxuICAgICAgICB7IGxheWVyOiAnZGVmYXVsdCcgfSxcbiAgICAgIF0sXG4gICAgXSxcbiAgICBwcmVmbGlnaHRzOiBbXG4gICAgICB7XG4gICAgICAgIGdldENTUzogKGNvbnRleHQpID0+IHtcbiAgICAgICAgICAvLyBnZW5lcmF0ZSBjc3MgdmFyaWFibGVzIGZvciBhbGwgY29sb3JzIGFuZCBhbGlhc2VzIGluIHVzZVxuICAgICAgICAgIHJldHVybiBnZW5lcmF0ZUNTU1ZhcmlhYmxlc0ZvckNvbG9yc0luVXNlKHtcbiAgICAgICAgICAgIGRhcmtTZWxlY3RvcixcbiAgICAgICAgICAgIGxpZ2h0U2VsZWN0b3IsXG4gICAgICAgICAgICBwcmVmaXgsXG4gICAgICAgICAgICB1c2VQM0NvbG9ycyxcbiAgICAgICAgICAgIG9ubHlPbmVUaGVtZSxcbiAgICAgICAgICAgIGFsaWFzZXMsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGxheWVyOiBsYXllcixcbiAgICAgIH0sXG4gICAgXSxcbiAgICBleHRlbmRUaGVtZTogKHRoZW1lOiBUaGVtZSkgPT4ge1xuICAgICAgcmV0dXJuIGV4dGVuZFRoZW1lKHsgdGhlbWUsIHByZWZpeCwgZXh0ZW5kIH0pO1xuICAgIH0sXG4gIH07XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdYLFNBQVMsb0JBQW9CO0FBQzdZLFNBQVMsaUJBQWlCOzs7QUNBMUIsWUFBWSxpQkFBaUI7OztBQ3FCN0IsSUFBTSxjQUFjLENBQUM7QUFFZCxTQUFTLGlCQUFpQjtBQUMvQixTQUFPO0FBQ1Q7QUFLTyxTQUFTLFNBQVMsRUFBRSxLQUFLLE1BQU0sTUFBTSxHQUFvRTtBQUM5RyxjQUFZLEdBQUcsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO0FBQ3hDLGNBQVksR0FBRyxFQUFFLGFBQWEsWUFBWSxHQUFHLEVBQUUsY0FBYyxDQUFDO0FBQzlELGNBQVksR0FBRyxFQUFFLFdBQVcsR0FBRyxJQUFJLEdBQUcsS0FBSyxFQUFlLElBQUksRUFBRSxLQUFLLE1BQU0sTUFBTTtBQUNuRjs7O0FDWEEsSUFBTSxlQUFlLENBQUM7QUFFZixTQUFTLGtCQUFrQjtBQUNoQyxTQUFPO0FBQ1Q7QUFFTyxTQUFTLGlCQUFpQixFQUFFLE9BQU8sTUFBTSxNQUFNLEdBQStDO0FBQ25HLGVBQWEsS0FBSyxJQUFJLGFBQWEsS0FBSyxLQUFLLENBQUM7QUFDOUMsZUFBYSxLQUFLLEVBQUUsYUFBYSxhQUFhLEtBQUssRUFBRSxjQUFjLENBQUM7QUFDcEUsZUFBYSxLQUFLLEVBQUUsZUFBZSxhQUFhLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQztBQUV4RSxlQUFhLEtBQUssRUFBRSxXQUFXLEdBQUcsSUFBSSxHQUFHLEtBQUssRUFBZSxJQUFJO0FBQUEsSUFDL0Q7QUFBQSxJQUNBO0FBQUE7QUFBQSxFQUVGO0FBQ0Y7QUFFTyxTQUFTLHdCQUF3QixFQUFFLE9BQU8sWUFBWSxHQUE0RDtBQUN2SCxlQUFhLEtBQUssSUFBSSxhQUFhLEtBQUssS0FBSyxDQUFDO0FBQzlDLGVBQWEsS0FBSyxFQUFFLGFBQWEsYUFBYSxLQUFLLEVBQUUsY0FBYyxDQUFDO0FBQ3BFLGVBQWEsS0FBSyxFQUFFLGVB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QUFRLENBQUMsWUFBWTtBQUVuQixpQkFBTyxtQ0FBbUM7QUFBQSxZQUN4QztBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsVUFDRixDQUFDO0FBQUEsUUFDSDtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsYUFBYSxDQUFDLFVBQWlCO0FBQzdCLGFBQU8sWUFBWSxFQUFFLE9BQU8sUUFBUSxPQUFPLENBQUM7QUFBQSxJQUM5QztBQUFBLEVBQ0Y7QUFDRjs7O0FSM0tBLE9BQU8sWUFBWTtBQUluQixJQUFPLGlCQUFRLGFBQWE7QUFBQSxFQUMxQixPQUFPO0FBQUEsRUFDUCxNQUFNO0FBQUEsRUFDTixNQUFNO0FBQUEsSUFDSixTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxTQUFTO0FBQUEsVUFDUCxVQUFVO0FBQUEsVUFDVixZQUFZO0FBQUEsWUFDVixjQUFjO0FBQUEsWUFDZCxTQUFTO0FBQUEsY0FDUCxPQUFPO0FBQUEsY0FDUCxPQUFPO0FBQUEsWUFDVDtBQUFBLFlBQ0EsVUFBVSxDQUFDLEdBQUcsWUFBYSxTQUFTLFVBQVMsV0FBWSxVQUFVO0FBQUEsVUFDckUsQ0FBQztBQUFBLFFBQ0g7QUFBQSxNQUNGLENBQUM7QUFBQSxJQUNIO0FBQUEsRUFDRjtBQUFBLEVBQ0EsYUFBYTtBQUFBLEVBQ2IsYUFBYTtBQUFBLElBQ1gsS0FBSyxDQUFDLEVBQUUsTUFBTSxRQUFRLE1BQU0sSUFBSSxDQUFDO0FBQUEsSUFDakMsU0FBUztBQUFBLE1BQ1A7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLE9BQU87QUFBQSxVQUNMLEVBQUUsTUFBTSx3QkFBd0IsTUFBTSxZQUFZO0FBQUEsVUFDbEQsRUFBRSxNQUFNLGlCQUFpQixNQUFNLG9CQUFvQjtBQUFBLFVBQ25ELEVBQUUsTUFBTSxpQkFBaUIsTUFBTSxvQkFBb0I7QUFBQSxVQUNuRCxFQUFFLE1BQU0scUJBQXFCLE1BQU0sd0JBQXdCO0FBQUEsUUFDN0Q7QUFBQSxNQUNGO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sT0FBTyxDQUFDLEVBQUUsTUFBTSxVQUFVLE1BQU0sVUFBVSxDQUFDO0FBQUEsTUFDN0M7QUFBQSxJQUNGO0FBQUEsSUFFQSxhQUFhO0FBQUEsTUFDWDtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLE1BQ1I7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbImFsaWFzZXNJblVzZSIsICJjb2xvcnNJblVzZSIsICJhbGlhc2VzSW5Vc2UiLCAiX2EiLCAiX2IiLCAiX2MiLCAiX2QiLCAiYWxpYXNlc0luVXNlIl0KfQo=
