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
export type Size = { width: number | null; height: number | null };

export type BorderStyle = {
  color: Color;
  width: number;
  style: "dotted" | "solid" | "broken";
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
  id?: string;
  name?: string;
  min?: Size;
  max?: Size;
  meta?: Record<string, any>;
  visible?: boolean;
  opacity?: number; // 0 to 1
  color: Color;
  borderRadius?: {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
  };
  margin?: boxModelOffset;
  padding?: boxModelOffset;
  fixedSize?: Size;
  type: ElementTypes;
  video?: string | null;
  outline?: BorderStyle | null;
  background: {
    color: Color;
    imageSize?: Size;
    image?: string | null;
    linearGradient?: LinearGradient | null;
    radialGradient?: RadialGradient | null;
  };
};
