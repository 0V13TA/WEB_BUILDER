export function parseBoxSpacing(spacing?: number | (number | undefined)[]): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  if (spacing === undefined) return { top: 0, right: 0, bottom: 0, left: 0 };
  if (typeof spacing === "number")
    return { top: spacing, right: spacing, bottom: spacing, left: spacing };

  if (Array.isArray(spacing)) {
    const undefinedIndices = spacing
      .map((v, i) => (v === undefined ? i : -1))
      .filter((i) => i !== -1);
    if (undefinedIndices.length > 0) {
      console.warn(
        `parseBoxSpacing: Undefined value(s) at index/indices [${undefinedIndices.join(
          ", "
        )}] in spacing array:`,
        spacing,
        "\nThese values will default to 0.",
        new Error().stack
      );
    }
  }

  const [top, right, bottom, left] = [
    spacing[0] ?? 0,
    spacing[1] ?? 0,
    spacing[2] ?? 0,
    spacing[3] ?? 0
  ];

  switch (spacing.length) {
    case 0:
      return { top: 0, right: 0, bottom: 0, left: 0 };
    case 1:
      return { top, right: top, bottom: top, left: top };
    case 2:
      return { top, right, bottom: top, left: right };
    case 3:
      return { top, right, bottom, left: right };
    default:
      return { top, right, bottom, left };
  }
}
