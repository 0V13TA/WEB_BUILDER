import Element from "./element";
import type { ElementType } from "../utils/types";
import { rgbaToHex } from "../utils/colorUtils";

export default class FlexContainer extends Element {
  constructor(value: Partial<ElementType>) {
    super({ ...value, type: "flexContainer" });
  }

  public draw(_ctx: CanvasRenderingContext2D): void {
    if (this.value.grows) {
      const { width, height } = this.getChildrenSizes();
      this.value.size = { width, height };
    }

    _ctx.save();
    this.drawPadding(_ctx);
    this.drawContent(_ctx);
    _ctx.translate(this.value.scrollX!, this.value.scrollY!);
    this.horizontalAlign(_ctx);
    _ctx.clip();

    _ctx.restore();
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
    const { x, y } = this.getBoxModelOffset();
    const borderWidth = this.getBorderWidth();
    const { top, right, bottom, left } = this.getPadding();
    const { top: mTop, left: mLeft } = this.getMargin();
    this.drawBorder(
      ctx,
      borderWidth,
      { top, right, bottom, left },
      { mTop, mLeft }
    );
    ctx.beginPath();
    ctx.fillStyle = rgbaToHex(this.value.background.color);

    this.value.borderRadius
      ? this.drawRoundedRect(
          ctx,
          this.value.position?.x! + x,
          this.value.position?.y! + y,
          this.value.size?.width! + left + right,
          this.value.size?.height! + top + bottom
        )
      : ctx.fillRect(
          this.value.position?.x! + x - left,
          this.value.position?.y! + y - top,
          this.value.size?.width! + left + right,
          this.value.size?.height! + top + bottom
        );
    ctx.closePath();
    ctx.fill();
  }

  private drawBorder(
    ctx: CanvasRenderingContext2D,
    borderWidth: number,
    padding: { top: number; bottom: number; left: number; right: number },
    margin: { mTop: number; mLeft: number }
  ) {
    ctx.beginPath();
    this.decideStroke(ctx);
    ctx.lineWidth = this.value.border!.width;
    ctx.strokeStyle = rgbaToHex(this.value.border!.color);

    this.value.borderRadius
      ? this.drawRoundedRect(
          ctx,
          this.value.position?.x! + margin.mLeft,
          this.value.position?.y! + margin.mTop,
          this.value.size?.width! + padding.left + padding.right + borderWidth,
          this.value.size?.height! + padding.top + padding.bottom + borderWidth
        )
      : ctx.strokeRect(
          this.value.position?.x! + margin.mLeft,
          this.value.position?.y! + margin.mTop,
          this.value.size?.width! + padding.left + padding.right + borderWidth,
          this.value.size?.height! + padding.top + padding.bottom + borderWidth
        );
    ctx.closePath();
    ctx.stroke();
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

  private getChildrenSizes() {
    let width = 0,
      height = 0;
    const children = this.getChildren();

    for (const child of children) {
      const size = child.getBoxModelSize();
      width += size.width;
      height = Math.max(size.height, height);
    }

    width += this.value.gap! * (children.length - 1);

    return { width, height };
  }

  private horizontalAlign(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.getBoxModelOffset();
    const children = this.getChildren();
    let offsetX = this.value.position!.x + x,
      offsetY = this.value.position!.y + y;

    for (const child of children) {
      const { width } = child.getBoxModelSize();

      if (
        this.value.flexWrap &&
        this.value.flexWrap != "nowrap" &&
        offsetX + child.value.size?.width! >
          this.value.size?.width!
      ) {
        offsetX = this.value.position!.x + x;
        offsetY += child.value.size?.height! + this.value.gap!;
        console.log("here");
      }

      child.value.position = { x: offsetX, y: offsetY };
      child.draw(ctx);
      offsetX += width + this.value.gap!;
    }
  }

  public override isScrollable(): boolean {
    return true;
  }
}
