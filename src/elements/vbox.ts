import Container from "./container";
import type Element from "./element";
import { rgbaToHex } from "../utils/colorUtils";
import type { Color, ContainerType } from "../utils/types";
import { parseBoxSpacing } from "../utils/parseBoxSpacing";

export default class Vbox extends Container<ContainerType> {
  constructor(value: ContainerType, pos?: { x: number; y: number }) {
    pos ? super(value, pos) : super(value);
    this.value.type = "vbox";
    this.computeChildrenMetrics();
  }

  draw(_ctx: CanvasRenderingContext2D): void {
    _ctx.beginPath();
    _ctx.fillStyle =
      rgbaToHex(this.value.background?.color as Color) ?? "black";
    this.drawContent(_ctx);
    _ctx.fill();
    _ctx.closePath();
    this.layoutChildren(_ctx);
  }

  public addChild(child: Element<ContainerType>): void {
    this.children.push(child);
    this.computeChildrenMetrics();
  }

  private drawContent(ctx: CanvasRenderingContext2D): void {
    const [xPos, yPos] = this.getContentPos(this.xPos, this.yPos).totalOffsets;
    ctx.fillRect(xPos, yPos, this.size.width, this.size.height);
    this.drawOutline(ctx, this.size.width, this.size.height);
  }

  protected computeChildrenMetrics(): void {
    const children = this.getChildren();
    const outline = this.value.outline?.width ?? 0;
    const childGap = this.value.childGap ?? 0;
    const wrap = this.value.wrap;
    const padding = parseBoxSpacing(this.value.padding);

    const xPadding = padding.left + padding.right;
    const yPadding = padding.top + padding.bottom;

    // Wrapping logic (vertical)
    let columnWidths: number[] = [];
    let columnHeights: number[] = [];
    let currentColumnWidth = 0;
    let currentColumnHeight = 0;
    let childCountInColumn = 0;
    const maxHeight =
      this.value.max?.height ??
      this.value.fixedSize?.height ??
      this.size.height;

    for (const child of children) {
      const [width, height] = child.computeModalSize();

      if (
        wrap &&
        currentColumnHeight + height > maxHeight &&
        childCountInColumn > 0
      ) {
        columnWidths.push(currentColumnWidth);
        columnHeights.push(currentColumnHeight - childGap); // Remove last gap
        currentColumnWidth = 0;
        currentColumnHeight = 0;
        childCountInColumn = 0;
      }

      currentColumnHeight += height + (childCountInColumn > 0 ? childGap : 0);
      currentColumnWidth = Math.max(currentColumnWidth, width);
      childCountInColumn++;
    }

    if (childCountInColumn > 0) {
      columnWidths.push(currentColumnWidth);
      columnHeights.push(currentColumnHeight - childGap);
    }

    // Total width/height from children
    const childrenWidth =
      columnWidths.reduce((a, b) => a + b, 0) +
      childGap * (columnWidths.length - 1);
    const childrenHeight =
      columnHeights.length > 0 ? Math.max(...columnHeights) : 0;

    // Add container's own padding, margin, and outline
    const totalWidth = childrenWidth + xPadding + outline;
    const totalHeight = childrenHeight + yPadding + outline * 2;

    // Set the size property
    if (this.value.fixedSize) {
      this.size = {
        width: this.value.fixedSize.width ?? totalWidth,
        height: this.value.fixedSize.height ?? totalHeight
      };
    } else {
      this.size = {
        width: totalWidth,
        height: totalHeight
      };
    }
  }

  public layoutChildren(_ctx: CanvasRenderingContext2D): void {
    const margin = parseBoxSpacing(this.value.margin);
    const parentOutlineWidth = this.value.outline?.width ?? 0;
    const offsetStartX = this.xPos + parentOutlineWidth / 2 + margin.left;
    const offsetStartY = this.yPos + parentOutlineWidth / 2 + margin.top;
    let offsetX = offsetStartX;
    let offsetY = offsetStartY;
    let columnMaxWidth = 0;

    const children = this.getChildren() as Vbox[];
    const childGap = this.value.childGap ?? 0;
    const maxHeight =
      this.value.max?.height ??
      this.value.fixedSize?.height ??
      this.size.height;

    for (const child of children) {
      const [width, height] = child.computeModalSize();

      // Wrapping: only use the parent's maxHeight for comparison
      if (
        this.value.wrap &&
        offsetY + height > offsetStartY + maxHeight - parentOutlineWidth &&
        offsetY > offsetStartY // Only wrap if not at the very top
      ) {
        offsetX += columnMaxWidth + childGap;
        offsetY = offsetStartY;
        columnMaxWidth = 0;
      }

      child.xPos = offsetX;
      child.yPos = offsetY;
      child.size.width = width;
      child.size.height = height;

      offsetY += height + childGap;
      if (width > columnMaxWidth) columnMaxWidth = width;

      child.layoutChildren(_ctx);
      child.draw(_ctx);
    }
  }
}
