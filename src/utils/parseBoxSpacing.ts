export function parseBoxSpacing(spacing?: number | number[]): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  if (spacing === undefined) return { top: 0, right: 0, bottom: 0, left: 0 };
  if (typeof spacing === "number")
    return { top: spacing, right: spacing, bottom: spacing, left: spacing };
  switch (spacing.length) {
    case 1:
      return {
        top: spacing[0],
        right: spacing[0],
        bottom: spacing[0],
        left: spacing[0]
      };
    case 2:
      return {
        top: spacing[0],
        right: spacing[1],
        bottom: spacing[0],
        left: spacing[1]
      };
    case 3:
      return {
        top: spacing[0],
        right: spacing[1],
        bottom: spacing[2],
        left: spacing[1]
      };
    case 4:
      return {
        top: spacing[0],
        right: spacing[1],
        bottom: spacing[2],
        left: spacing[3]
      };
    default:
      return { top: 0, right: 0, bottom: 0, left: 0 };
  }
}
