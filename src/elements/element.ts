import { Node } from "../utils/tree/node";
import type { ElementType } from "../utils/types";
import parseBorderRadius from "../utils/parseBorderRadii";
import { parseBoxSpacing } from "../utils/parseBoxSpacing";

const defaultColor: [number, number, number, number] = [0, 0, 0, 1];

export const defaultElementType: ElementType = {
  gap: 0,
  id: "",
  meta: {},
  name: "",
  video: "",
  margin: 0,
  scrollX: 0,
  padding: 0,
  scrollY: 0,
  flexGrow: 0,
  grows: false,
  flexShrink: 0,
  visible: true,
  alignY: "top",
  alignX: "left",
  type: "element",
  flexWrap: "wrap",
  scrollable: false,
  flexBasis: "auto",
  color: defaultColor,
  flexDirection: "row",
  borderRadius: undefined,
  position: { x: 0, y: 0 },
  min: { width: 0, height: 0 },
  size: { width: 100, height: 100 },
  scrollBounds: { width: 0, height: 0 },
  max: { width: Infinity, height: Infinity },
  border: { gap: 0, width: 0, color: [0, 0, 0, 0], style: "solid" },

  background: {
    imageSrc: undefined,
    imageSize: undefined,
    color: [255, 255, 255, 1],
    linearGradient: undefined,
    radialGradient: undefined
  }
};

export default class Element extends Node<ElementType> {
  value: ElementType;

  constructor(value: Partial<ElementType>) {
    super({ ...defaultElementType, ...value });
    this.value = { ...defaultElementType, ...value };
    const { top, left } = this.getMargin();
    const borderWidth = this.getBorderWidth();
    this.value.position = {
      x: this.value.position!.x + left + borderWidth / 2,
      y: this.value.position!.y + top + borderWidth / 2
    };
  }

  public draw(_ctx: CanvasRenderingContext2D): void {
    throw new Error("Method (draw) must be implemented in subclasses");
  }

  addChild(child: Element): void {
    super.addChild(child);
  }

  getChildren(): Element[] {
    return super.getChildren() as Element[];
  }

  protected getPadding(): {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } {
    return parseBoxSpacing(this.value.padding);
  }

  protected getMargin(): {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } {
    return parseBoxSpacing(this.value.margin);
  }

  public getBoxModelSize(): { width: number; height: number } {
    // Content size (from fixedSize or min/max fallback)
    const contentHeight =
      this.value.size?.height ?? this.value.min?.height ?? 0;
    const contentWidth = this.value.size?.width ?? this.value.min?.width ?? 0;

    const margin = this.getMargin();
    const padding = this.getPadding();
    const borderWidth = this.getBorderWidth();

    const width =
      contentWidth +
      padding.left +
      padding.right +
      borderWidth * 2 +
      margin.left +
      margin.right;

    const height =
      contentHeight +
      padding.top +
      padding.bottom +
      borderWidth * 2 +
      margin.top +
      margin.bottom;

    return { width, height };
  }

  protected drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    let radius = parseBorderRadius(this.value.borderRadius);
    ctx.beginPath();

    ctx.moveTo(x + radius.topLeft, y);
    ctx.lineTo(x + width - radius.topRight, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.topRight);
    ctx.lineTo(x + width, y + height - radius.bottomRight);
    ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radius.bottomRight,
      y + height
    );
    ctx.lineTo(x + radius.bottomLeft, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bottomLeft);
    ctx.lineTo(x, y + radius.topLeft);
    ctx.quadraticCurveTo(x, y, x + radius.topLeft, y);
    ctx.closePath();
  }

  protected getBorderWidth(): number {
    return this.value.border?.width ?? 0;
  }

  protected getBoxModelOffset(): { x: number; y: number } {
    const margin = this.getMargin();
    const padding = this.getPadding();
    const borderWidth = this.getBorderWidth();

    return {
      x: padding.left + margin.left + borderWidth / 2,
      y: padding.top + margin.top + borderWidth / 2
    };
  }

  protected getGlobalBounds(): {
    x: number;
    y: number;
    width: number;
    height: number;
  } {
    const { left, top } = this.getPadding();
    const x = this.value.position?.x! + left;
    const y = this.value.position?.y! + top;
    const width = this.value.size?.width!;
    const height = this.value.size?.height!;

    return { x, width, y, height };
  }

  public isScrollable(): boolean {
    return false;
  }
}
