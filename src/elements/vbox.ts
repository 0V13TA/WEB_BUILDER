import { isValidRGBA, rgbaToHex } from "../utils/colorUtils";
import type { Color, ElementType } from "../utils/types";
import Container from "./container";

export default class Vbox extends Container {
  constructor(value: ElementType) {
    super(value);
    this.value.type = "vbox";
    if (!isValidRGBA(value.color).isValid)
      throw new Error(`Invalid Color: ${isValidRGBA(value.color).message}`);

    if (!isValidRGBA(value.background.color).isValid)
      throw new Error(
        `Invalid Background Color: ${
          isValidRGBA(value.background.color).message
        }`
      );

    if (!this.value.background.color) value.background.color = [0, 0, 0, 1];
  }

  draw(_ctx: CanvasRenderingContext2D): void {
    _ctx.beginPath();
    _ctx.fillStyle =
      rgbaToHex(this.value.background?.color as Color) ?? "black";
    if (this.value.fixedSize) {
      _ctx.fillRect(
        0,
        0,
        this.value.fixedSize.width ?? 0,
        this.value.fixedSize.height ?? 0
      );
    } else _ctx.fillRect(0, 0, 300, 400);
    _ctx.fill();
    _ctx.closePath();
  }
}
