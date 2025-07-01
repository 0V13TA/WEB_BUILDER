import parseBorderRadius from "../utils/parseBorderRadii";
import { parseBoxSpacing } from "../utils/parseBoxSpacing";
import { Node } from "../utils/tree/node";
import type { ElementType } from "../utils/types";

const defaultColor: [number, number, number, number] = [0, 0, 0, 1];

export const defaultElementType: ElementType = {
  min: { width: 0, height: 0 },
  max: { width: Infinity, height: Infinity },
  id: "",
  color: defaultColor,
  name: "",
  video: "",
  size: { width: 100, height: 100 },
  visible: true,
  type: "element",
  margin: 0,
  padding: 0,
  border: { gap: 0, width: 0, color: [0, 0, 0, 0], style: "solid" },
  meta: {},
  position: { x: 0, y: 0 },
  borderRadius: undefined,
  background: {
    color: [255, 255, 255, 1],
    imageSize: undefined,
    imageSrc: undefined,
    linearGradient: undefined,
    radialGradient: undefined
  },
  flexGrow: 0,
  flexShrink: 0,
  flexBasis: "auto",
  alignSelf: "flex-start",
  gap: 0,
  grows: false,
  flexWrap: "wrap",
  alignItems: "stretch",
  flexDirection: "row",
  alignContent: "stretch",
  justifyContent: "flex-start"
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
    const contentWidth = this.value.size?.width ?? this.value.min?.width ?? 0;
    const contentHeight =
      this.value.size?.height ?? this.value.min?.height ?? 0;

    const padding = this.getPadding();
    const margin = this.getMargin();
    const borderWidth = this.getBorderWidth();

    // Total size = content + padding (both sides) + border (both sides) + margin (both sides)
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
    console.log(radius);
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
    const padding = this.getPadding();
    const margin = this.getMargin();
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

  public handleEvent(e: MouseEvent | WheelEvent): boolean {
    const bounds = this.getGlobalBounds();

    if (this.value.hidden) return false;

    const withinX =
      e.clientX >= bounds.x && e.clientX <= bounds.x + bounds.width;
    const withinY =
      e.clientY >= bounds.y && e.clientY <= bounds.y + bounds.height;
    const withinBounds = withinX && withinY;

    const children = this.getChildren();
    for (const child of children) {
      if (child.handleEvent(e)) return true;
    }

    if (e instanceof WheelEvent && withinBounds) {
      const self = this.getScrollableInfo();

      if (self) {
        self.scrollX += e.deltaX;
        self.scrollY += e.deltaY;

        const maxX = self.scrollBounds.width - (self.value.size?.width ?? 0);
        const maxY = self.scrollBounds.height - (self.value.size?.height ?? 0);

        self.scrollX = Math.max(0, Math.min(maxX, self.scrollX));
        self.scrollY = Math.max(0, Math.min(maxY, self.scrollY));

        return true;
      }
    }

    return false;
  }

  public getScrollableInfo(): {
    scrollX: number;
    scrollY: number;
    scrollBounds: { width: number; height: number };
    value: { size?: { width: number; height: number } };
  } | null {
    return null;
  }
}
