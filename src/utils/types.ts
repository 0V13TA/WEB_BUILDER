export type ElementTypes =
  | "box"
  | "grid"
  | "text"
  | "circle"
  | "element"
  | "flexContainer";

export type GradientDirection =
  | "top"
  | "top-left"
  | "top-right"
  | "bottom"
  | "bottom-left"
  | "bottom-right"
  | "left"
  | "right";

// In your types.ts
export type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
export type JustifyContent =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
export type AlignItems =
  | "flex-start"
  | "flex-end"
  | "center"
  | "stretch"
  | "baseline";
export type AlignContent =
  | "flex-start"
  | "flex-end"
  | "center"
  | "stretch"
  | "space-between"
  | "space-around";

export type Color = readonly [r: number, g: number, b: number, a: number];
export type Size = { width?: number; height?: number };

export type BorderStyle = {
  gap?: number;
  color: Color;
  width: number;
  style: "dotted" | "solid" | "dashed";
};

export type GradientStop = {
  color: Color;
  offset: number; // 0 to 1, where the stop is in the gradient
};

export type LinearGradient = {
  stops: GradientStop[];
  to: GradientDirection | null;
};

export type RadialGradient = {
  radius: number; // normalized 0-1
  stops: GradientStop[];
  center: { x: number; y: number }; // normalized 0-1
};

export type boxModelOffset = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export type BoxSpacing =
  | number
  | [number]
  | [number, number]
  | [number, number, number]
  | [number, number, number, number];

export type ElementType = {
  min?: Size;
  max?: Size;
  id?: string;
  size?: Size;
  gap?: number;
  color?: Color;
  name?: string;
  video?: string;
  grows?: boolean;
  hidden?: boolean;
  visible?: boolean;
  flexGrow?: number;
  type?: ElementTypes;
  margin?: BoxSpacing;
  flexShrink?: number;
  flexWrap?: FlexWrap;
  padding?: BoxSpacing;
  border?: BorderStyle;
  alignSelf?: AlignItems;
  alignItems?: AlignItems;
  borderRadius?: BoxSpacing;
  meta?: Record<string, any>;
  flexBasis?: number | "auto";
  alignContent?: AlignContent;
  flexDirection?: FlexDirection;
  justifyContent?: JustifyContent;

  position?: {
    x: number;
    y: number;
  };
  background: {
    color: Color;
    imageSize?: Size;
    imageSrc?: string;
    linearGradient?: LinearGradient;
    radialGradient?: RadialGradient;
  };
};
