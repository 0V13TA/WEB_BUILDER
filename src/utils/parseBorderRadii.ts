export default function parseBorderRadius(
  spacing?: number | (number | undefined)[]
): {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
} {
  if (spacing === undefined)
    return { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 };
  if (typeof spacing === "number")
    return {
      topLeft: spacing,
      topRight: spacing,
      bottomLeft: spacing,
      bottomRight: spacing
    };

  if (Array.isArray(spacing)) {
    const undefinedIndices = spacing
      .map((spacingValue, spacingIndex) =>
        spacingValue === undefined ? spacingIndex : -1
      )
      .filter((spacingIndex) => spacingIndex !== -1);
    if (undefinedIndices.length > 0) {
      console.warn(
        `parseBoxSpacing: Undefined value(s) at index/indices [${undefinedIndices.join(
          ", "
        )}] in spacing array: ${spacing}\nThese values will default to 0. ${
          new Error().stack
        }`
      );
    }
  }

  const [topLeft, topRight, bottomLeft, bottomRight] = [
    spacing[0] ?? 0,
    spacing[1] ?? 0,
    spacing[2] ?? 0,
    spacing[3] ?? 0
  ];

  switch (spacing.length) {
    case 0:
      return { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 };
    case 1:
      return {
        topLeft,
        topRight: topLeft,
        bottomLeft: topLeft,
        bottomRight: topLeft
      };
    case 2:
      return {
        topLeft,
        topRight: topLeft,
        bottomLeft: topRight,
        bottomRight: topRight
      };
    case 3:
      return {
        topLeft,
        topRight,
        bottomLeft: bottomLeft,
        bottomRight: topRight
      };
    default:
      return {
        topLeft,
        topRight,
        bottomLeft,
        bottomRight
      };
  }
}
