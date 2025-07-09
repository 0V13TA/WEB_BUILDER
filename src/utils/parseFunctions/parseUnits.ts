export default function parseUnit(
  input: number | string,
  relativeTo?: number,
  canvas?: HTMLCanvasElement
): number {
  if (typeof input === "number") return input;

  const trimmed = input.trim();
  const value = parseFloat(trimmed);

  if (trimmed.endsWith("px")) {
    return value;
  } else if (trimmed.endsWith("%")) {
    if (relativeTo === undefined) {
      console.warn(
        `[Unit Warning] Percentage unit "${input}" requires a relative value.\nStack Trace:\n${
          new Error().stack
        }`
      );
      return 0;
    }
    return (value / 100) * relativeTo;
  } else if (trimmed.endsWith("vh")) {
    if (!canvas) {
      console.warn(
        `[Unit Warning] "vh" unit used but canvas is missing.\nStack Trace:\n${
          new Error().stack
        }`
      );
      return 0;
    }
    return (value / 100) * canvas.height;
  } else if (trimmed.endsWith("vw")) {
    if (!canvas) {
      console.warn(
        `[Unit Warning] "vw" unit used but canvas is missing.\nStack Trace:\n${
          new Error().stack
        }`
      );
      return 0;
    }
    return (value / 100) * canvas.width;
  } else {
    console.warn(
      `[Unit Warning] Unknown unit "${input}", defaulting to pixel interpretation.\nStack Trace:\n${
        new Error().stack
      }`
    );
    return value;
  }
}
