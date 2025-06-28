import Container from "./container";
import type { Color, ElementType } from "../utils/types";
import { rgbaToHex } from "../utils/colorUtils";

export default class Vbox extends Container {
  constructor(value: ElementType, pos?: { x: number; y: number }) {
    pos ? super(value, pos) : super(value);
    this.value.type = "vbox";
  }

  draw(_ctx: CanvasRenderingContext2D): void {
    _ctx.beginPath();
    _ctx.fillStyle =
      rgbaToHex(this.value.background?.color as Color) ?? "black";
    this.drawContent(_ctx);
    _ctx.fill();
    _ctx.closePath();
  }

  private drawContent(ctx: CanvasRenderingContext2D): void {
    const [xPos, yPos] = this.getContentPos(this.xPos, this.yPos).totalOffsets;
    ctx.fillRect(xPos, yPos, this.size.width, this.size.height);
    this.drawOutline(ctx, this.size.width, this.size.height);
  }

  public alignChildren(_ctx: CanvasRenderingContext2D): void {
    const margin = this.value.margin;
    let outlineWidth = this.value.outline?.width ?? 0;
    let offsetX = this.xPos + outlineWidth / 2 + (margin?.left ?? 0);
    let offsetY = this.yPos + outlineWidth / 2 + (margin?.top ?? 0);
    const children = this.getChildren();

    for (const child of children) {
      const childSize = child.computeModalSize();
      child.xPos = offsetX;
      child.yPos = offsetY;
      child.size.width = childSize[0];
      child.size.height = childSize[1];
      offsetY += childSize[1] + (this.value.childGap ?? 0);
      child.draw(_ctx);
    }

    console.log(offsetX, offsetY);
  }
}
