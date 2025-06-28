export type ElementTypes =
  | "box"
  | "vbox"
  | "hbox"
  | "grid"
  | "text"
  | "circle"
  | "element";

export type GradientDirection =
  | "top"
  | "top-left"
  | "top-right"
  | "bottom"
  | "bottom-left"
  | "bottom-right"
  | "left"
  | "right";

export type Color = [r: number, g: number, b: number, a: number];
export type Size = { width: number; height: number };

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

export type ElementType = {
  min?: Size;
  max?: Size;
  id?: string;
  size?: Size;
  color?: Color;
  name?: string;
  video?: string;
  fixedSize?: Size;
  visible?: boolean;
  childGap?: number;
  type: ElementTypes;
  outline?: BorderStyle;
  margin?: boxModelOffset;
  padding?: boxModelOffset;
  meta?: Record<string, any>;

  position?: {
    x: number;
    y: number;
  };
  borderRadius?: {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
  };
  background: {
    color: Color;
    imageSize?: Size;
    imageSrc?: string;
    linearGradient?: LinearGradient;
    radialGradient?: RadialGradient;
  };
};
