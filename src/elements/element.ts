import { Node } from "../utils/tree/node";
import { type ElementType } from "../utils/types";
import { isValidRGBA, rgbaToHex } from "../utils/colorUtils";

export default class Element<
  T extends ElementType = ElementType
> extends Node<T> {
  xPos: number = 0;
  yPos: number = 0;
  size: { width: number; height: number };

  constructor(value: T, pos?: { x: number; y: number }) {
    super(value);
    this.xPos = pos?.x ?? value.position?.x ?? 0;
    this.yPos = pos?.y ?? value.position?.y ?? 0;
    this.size = {
      width: value.size?.width ?? 300,
      height: value.size?.height ?? 400
    };

    if (!value.background.color) value.background.color = [0, 0, 0, 0];
    if (value.color && !isValidRGBA(value.color).isValid)
      throw new Error(`Invalid Color: ${isValidRGBA(value.color).message}`);
    if (!isValidRGBA(value.background.color).isValid)
      throw new Error(
        `Invalid Background Color: ${
          isValidRGBA(value.background.color).message
        }`
      );
  }

  public getChildren(): Element<T>[] {
    return this.children as Element<T>[];
  }

  draw(_ctx: CanvasRenderingContext2D) {
    throw new Error("The draw method has not been implemented.");
  }

  public computeModalSize(): [number, number] {
    // Get padding and margin
    const [xPadding, yPadding] = this.getPadding();
    const [xMargin, yMargin] = this.getMargins();

    // Use fixedSize if available, otherwise use this.size
    const contentWidth = this.value.fixedSize?.width ?? this.size.width;
    const contentHeight = this.value.fixedSize?.height ?? this.size.height;

    // Total size = content + padding + margin
    const width = contentWidth + xPadding + xMargin;
    const height = contentHeight + yPadding + yMargin;

    return [width, height];
  }

  protected drawOutline(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    const [xPadding, yPadding] = this.getPadding();
    const style = this.value.outline;
    const totalWidth = xPadding + width;
    const totalHeight = yPadding + height;
    const margin = this.value.margin;

    if (style) {
      ctx.lineWidth = style.width;
      ctx.strokeStyle = rgbaToHex(style.color);

      switch (style.style) {
        case "dotted":
          ctx.setLineDash([style.width, style.gap ?? style.width * 1.5]);
          break;
        case "dashed":
          ctx.setLineDash([style.width * 4, style.gap ?? style.width * 1.5]);
          break;
        case "solid":
        default:
          ctx.setLineDash([]);
          break;
      }
    } else {
      ctx.strokeStyle = rgbaToHex([0, 0, 0, 0]);
      ctx.setLineDash([]);
    }

    ctx.fillStyle = rgbaToHex(this.value.background.color);
    ctx.fillRect(
      this.xPos + (margin?.left ?? 0),
      this.yPos + (margin?.top ?? 0),
      totalWidth,
      totalHeight
    );
    ctx.fill();

    ctx.strokeRect(
      this.xPos + (margin?.left ?? 0),
      this.yPos + (margin?.top ?? 0),
      totalWidth,
      totalHeight
    );
    ctx.stroke();
  }

  protected getPadding(): [xPadding: number, yPadding: number] {
    if (this.value.padding) {
      let topPadding = this.value.padding.top ?? 0,
        rightPadding = this.value.padding.right ?? 0,
        bottomPadding = this.value.padding.bottom ?? 0,
        leftPadding = this.value.padding.left ?? 0;

      let xPadding = rightPadding + leftPadding,
        yPadding = topPadding + bottomPadding;

      return [xPadding, yPadding];
    }

    return [0, 0];
  }

  private getMargins(): [xMargin: number, yMargin: number] {
    if (this.value.margin) {
      let topMargin = this.value.margin?.top ?? 0,
        bottomMargin = this.value.margin?.bottom ?? 0,
        leftMargin = this.value.margin?.left ?? 0,
        rightMargin = this.value.margin?.right ?? 0;

      let xMargin = leftMargin + rightMargin,
        yMargin = topMargin + bottomMargin;

      return [xMargin, yMargin];
    }
    return [0, 0];
  }

  public getContentPos(
    relX: number,
    relY: number
  ): {
    totalOffsets: [xPos: number, yPos: number];
    marginOffsets: [xPos: number, yPos: number];
  } {
    const margin = {
      top: this.value.margin?.top ?? 0,
      bottom: this.value.margin?.bottom ?? 0,
      left: this.value.margin?.left ?? 0,
      right: this.value.margin?.right ?? 0
    };

    const padding = {
      top: this.value.padding?.top ?? 0,
      bottom: this.value.padding?.bottom ?? 0,
      left: this.value.padding?.left ?? 0,
      right: this.value.padding?.right ?? 0
    };

    const xPos = margin.left + padding.left + relX;
    const yPos = margin.top + padding.top + relY;

    const marginOffsets: [number, number] = [margin.left, margin.top];

    return { totalOffsets: [xPos, yPos], marginOffsets };
  }
}
