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
    ctx.save();

    if (this.value.borderRadius) {
      this.drawRoundedRect(
        ctx,
        this.value.position?.x! + x,
        this.value.position?.y! + y,
        this.value.size?.width!,
        this.value.size?.height!
      );
      ctx.clip();
    }

    ctx.fillStyle = rgbaToHex(this.value.background.color);
    ctx.fillRect(
      this.value.position?.x! + x,
      this.value.position?.y! + y,
      this.value.size?.width!,
      this.value.size?.height!
    );
    ctx.restore();
  }

  private drawPadding(ctx: CanvasRenderingContext2D): void {
    const borderWidth = this.getBorderWidth();
    const { top, right, bottom, left } = this.getPadding();
    this.drawBorder(ctx, borderWidth, { top, right, bottom, left });
    ctx.beginPath();
    ctx.fillStyle = rgbaToHex(this.value.background.color);

    this.value.borderRadius
      ? this.drawRoundedRect(
          ctx,
          this.value.position?.x!,
          this.value.position?.y!,
          this.value.size?.width! + left + right + borderWidth,
          this.value.size?.height! + top + bottom + borderWidth
        )
      : ctx.fillRect(
          this.value.position?.x!,
          this.value.position?.y!,
          this.value.size?.width! + left + right + borderWidth,
          this.value.size?.height! + top + bottom + borderWidth
        );
    ctx.closePath();
    ctx.fill();
  }

  private drawBorder(
    ctx: CanvasRenderingContext2D,
    borderWidth: number,
    padding: { top: number; bottom: number; left: number; right: number }
  ) {
    ctx.beginPath();
    this.value.borderRadius
      ? this.drawRoundedRect(
          ctx,
          this.value.position?.x!,
          this.value.position?.y!,
          this.value.size?.width! + padding.left + padding.right + borderWidth,
          this.value.size?.height! + padding.top + padding.bottom + borderWidth
        )
      : ctx.strokeRect(
          this.value.position?.x!,
          this.value.position?.y!,
          this.value.size?.width! + padding.left + padding.right + borderWidth,
          this.value.size?.height! + padding.top + padding.bottom + borderWidth
        );
    this.decideStroke(ctx);
    ctx.lineWidth = this.value.border!.width;
    ctx.strokeStyle = rgbaToHex(this.value.border!.color);
    ctx.stroke();
    ctx.closePath();
  }

  private decideStroke(ctx: CanvasRenderingContext2D) {
    switch (this.value.border!.style) {
      case "dotted":
        ctx.setLineDash([
          this.value.border!.width,
          this.value.border!.gap ?? this.value.border!.width * 1.5
        ]);
        break;
      case "dashed":
        ctx.setLineDash([
          this.value.border!.width * 4,
          this.value.border!.gap ?? this.value.border!.width * 1.5
        ]);
        break;
      case "solid":
      default:
        ctx.setLineDash([]);
        break;
    }
  }

  public alignChildren(_ctx: CanvasRenderingContext2D) {
    const children = this.getChildren();
    let offsetX = this.value.position!.x,
      offsetY = this.value.position!.y;

    console.log(
      `OffsexY: ${offsetY}\nOffsetX: ${offsetX}\nChildren: ${children}`
    );
  }
}
