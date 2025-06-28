import Container from "./container";
import type { Color, ElementType } from "../utils/types";
import { rgbaToHex } from "../utils/colorUtils";

export default class Vbox extends Container {
  constructor(value: ElementType) {
    super(value);
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
    const [xPos, yPos] = this.getContentPos(10, 10).totalOffsets;
    ctx.fillRect(xPos, yPos, 300, 400);
    this.drawOutline(ctx, 300, 400);
  }
}
