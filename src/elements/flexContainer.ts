import Element from "./element";
import type { ElementType } from "../utils/types";
import { rgbaToHex } from "../utils/colorUtils";

export default class FlexContainer extends Element {
  constructor(value: Partial<ElementType>) {
    super({ ...value, type: "flexContainer" });
  }

  public draw(_ctx: CanvasRenderingContext2D): void {
    this.drawPadding(_ctx);
    this.drawContent(_ctx);
  }

  private drawContent(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.getBoxModelOffset();
    ctx.beginPath();
    ctx.fillStyle = rgbaToHex(this.value.background.color);
    ctx.fillRect(
      this.value.position?.x! + x,
      this.value.position?.y! + y,
      this.value.size?.width!,
      this.value.size?.height!
    );
    ctx.fill();
    ctx.closePath();
  }

  private drawPadding(ctx: CanvasRenderingContext2D): void {
    const borderWidth = this.getBorderWidth();
    const { top, right, bottom, left } = this.getPadding();
    ctx.beginPath();
    ctx.lineWidth = this.value.border!.width;
    ctx.strokeStyle = rgbaToHex(this.value.border!.color);
    ctx.fillStyle = rgbaToHex(this.value.background.color);
    ctx.fillRect(
      this.value.position?.x!,
      this.value.position?.y!,
      this.value.size?.width! + left + right + borderWidth,
      this.value.size?.height! + top + bottom + borderWidth
    );
    ctx.strokeRect(
      this.value.position?.x!,
      this.value.position?.y!,
      this.value.size?.width! + left + right + borderWidth,
      this.value.size?.height! + top + bottom + borderWidth
    );
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }
}
