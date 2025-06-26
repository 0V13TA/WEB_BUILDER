import { type Color } from "./types";
export type hsla = [
  hue: number,
  saturation: number,
  lightness: number,
  alpha: number
];

function isValidHex(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(hex);
}

function expandHex(hex: string): string {
  // Expands #RGB or #RGBA to #RRGGBB or #RRGGBBAA
  if (hex.length === 3 || hex.length === 4) {
    return hex
      .split("")
      .map((x) => x + x)
      .join("");
  }
  return hex;
}

export function hexToRgba(hex: string): Color {
  if (!isValidHex(hex))
    throw new Error(
      "Invalid hex color format. Use #RRGGBB, #RGB, #RRGGBBAA, or #RGBA."
    );
  hex = hex.replace(/^#/, "");
  if (hex.length === 3 || hex.length === 4) {
    hex = expandHex(hex);
  }
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);
  let a = 1;
  if (hex.length === 8) {
    a = parseInt(hex.slice(6, 8), 16) / 255;
  }
  return [r, g, b, a];
}

export function rgbaToHex([red, green, blue, alpha]: Color): string {
  const hex =
    "#" +
    [red, green, blue].map((x) => x.toString(16).padStart(2, "0")).join("") +
    (alpha < 1
      ? Math.round(alpha * 255)
          .toString(16)
          .padStart(2, "0")
      : "");
  return hex;
}

export function rgbaToHsl([red, green, blue, alpha]: Color): hsla {
  red /= 255;
  green /= 255;
  blue /= 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case red:
        h = (green - blue) / d + (green < blue ? 6 : 0);
        break;
      case green:
        h = (blue - red) / d + 2;
        break;
      case blue:
        h = (red - green) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100, alpha];
}

function hueToRgb(
  lowerBound: number,
  upperBound: number,
  hueRatio: number
): number {
  if (hueRatio < 0) hueRatio += 1;
  if (hueRatio > 1) hueRatio -= 1;
  if (hueRatio < 1 / 6)
    return lowerBound + (upperBound - lowerBound) * 6 * hueRatio;
  if (hueRatio < 1 / 2) return upperBound;
  if (hueRatio < 2 / 3)
    return lowerBound + (upperBound - lowerBound) * (2 / 3 - hueRatio) * 6;
  return lowerBound;
}

export function hslToRgba(
  hue: number,
  saturation: number,
  lightness: number,
  alpha: number
): Color {
  hue /= 360;
  saturation /= 100;
  lightness /= 100;
  let r: number, g: number, b: number;

  if (saturation === 0) {
    r = g = b = lightness;
  } else {
    const q =
      lightness < 0.5
        ? lightness * (1 + saturation)
        : lightness + saturation - lightness * saturation;
    const p = 2 * lightness - q;
    r = hueToRgb(p, q, hue + 1 / 3);
    g = hueToRgb(p, q, hue);
    b = hueToRgb(p, q, hue - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), alpha];
}

export function hexToHsl(hex: string): hsla {
  return rgbaToHsl(hexToRgba(hex));
}

export function hslToHex(
  hue: number,
  saturation: number,
  lightness: number,
  alpha: number
): string {
  return rgbaToHex(hslToRgba(hue, saturation, lightness, alpha));
}
