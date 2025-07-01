import Element from "./element";
import type { ElementType } from "../utils/types";
import { rgbaToHex } from "../utils/colorUtils";

export default class FlexContainer extends Element {
  scrollX = 0;
  scrollY = 0;
  scrollBounds = { width: 0, height: 0 };
  constructor(value: Partial<ElementType>) {
    super({ ...value, type: "flexContainer" });
  }

  public draw(_ctx: CanvasRenderingContext2D): void {
    if (this.value.grows) {
      const { width, height } = this.getChildrenSizes();
      this.value.size = { width, height };
    }
    this.drawPadding(_ctx);
    this.drawContent(_ctx);
    this.horizontalAlign(_ctx);
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
          this.value.position?.x! + mLeft,
          this.value.position?.y! + mTop,
          this.value.size?.width! + left + right,
          this.value.size?.height! + top + bottom
        )
      : ctx.fillRect(
          this.value.position?.x! + mLeft,
          this.value.position?.y! + mTop,
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
    const borderWidth = this.getBorderWidth();

    for (const child of children) {
      const size = child.getBoxModelSize();
      width += size.width;
      height = Math.max(size.height, height);
    }

    width += this.value.gap! * (children.length - 1) + borderWidth;
    height += borderWidth;

    return { width, height };
  }

  private horizontalAlign(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.getBoxModelOffset();
    const children = this.getChildren();
    let offsetX = this.value.position!.x + x - this.scrollX,
      offsetY = this.value.position!.y + y - this.scrollY;

    for (const child of children) {
      const { width } = child.getBoxModelSize();
      child.value.position = { x: offsetX, y: offsetY };
      child.draw(ctx);
      offsetX += width + this.value.gap!;
    }

    console.log(`OffsexY: ${offsetY}\nOffsetX: ${offsetX}\n`, children);
  }

  public override getScrollableInfo(): {
    scrollX: number;
    scrollY: number;
    scrollBounds: { width: number; height: number };
    value: { size?: { width: number; height: number } };
  } | null {
    const self = this;
    return {
      get scrollX() {
        return self.scrollX;
      },
      set scrollX(v: number) {
        self.scrollX = v;
      },
      get scrollY() {
        return self.scrollY;
      },
      set scrollY(v: number) {
        self.scrollY = v;
      },
      scrollBounds: self.scrollBounds,
      value: {
        size: {
          width: self.value.size?.width!,
          height: self.value.size?.height!
        }
      }
    };
  }
}
