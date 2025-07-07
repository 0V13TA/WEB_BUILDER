export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
export type Size = { width?: number; height?: number };
export type Color = readonly [r: number, g: number, b: number, a: number];
export type FlexDirection = "row" | "column";

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

export type Align = "start" | "center" | "end";

export type Justify =
  | "start"
  | "center"
  | "end"
  | "space-between"
  | "space-around"
  | "space-evenly";

export type BorderStyle = {
  gap?: number;
  color: Color;
  width: number;
  style: "dotted" | "solid" | "dashed";
};

export type GradientStop = {
  color: Color;
  offset: number;
};

export type LinearGradient = {
  stops: GradientStop[];
  to: GradientDirection | null;
};

export type RadialGradient = {
  radius: number;
  stops: GradientStop[];
  center: { x: number; y: number };
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
  align?: Align;
  video?: string;
  grows?: boolean;
  scrollX?: number;
  scrollY?: number;
  hidden?: boolean;
  justify?: Justify;
  visible?: boolean;
  flexGrow?: number;
  type?: ElementTypes;
  margin?: BoxSpacing;
  flexShrink?: number;
  flexWrap?: FlexWrap;
  scrollable?: boolean;
  padding?: BoxSpacing;
  border?: BorderStyle;
  borderRadius?: BoxSpacing;
  meta?: Record<string, any>;
  flexBasis?: number | "auto";
  flexDirection?: FlexDirection;
  scrollBounds?: { width: number; height: number };

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
