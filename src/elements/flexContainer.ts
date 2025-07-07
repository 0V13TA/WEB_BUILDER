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

      this.value.size = {
        width: Math.min(this.value.max?.width!, width),
        height: Math.min(this.value.max?.height!, height)
      };
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

  private getChildrenSizesRow(): Element[][] {
    const rows: Element[][] = [];
    let currentRow: Element[] = [];
    let currentWidth = 0;

    const children = this.getChildren();
    const containerWidth = this.value.size?.width ?? Infinity;
    const gap = this.value.gap ?? 0;

    for (const child of children) {
      const childWidth = child.getBoxModelSize().width;

      const totalWidth =
        currentRow.length > 0 ? currentWidth + gap + childWidth : childWidth;

      if (
        this.value.flexWrap === "wrap" &&
        totalWidth > containerWidth &&
        currentRow.length > 0
      ) {
        rows.push(currentRow);
        currentRow = [child];
        currentWidth = childWidth;
      } else {
        currentRow.push(child);
        currentWidth = totalWidth;
      }
    }

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    console.log(rows);

    return rows;
  }

  private horizontalAlign(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.getBoxModelOffset();
    const rows = this.getChildrenSizesRow();
    const gap = this.value.gap ?? 0;
    const containerWidth = this.value.size?.width ?? Infinity;

    let offsetY = this.value.position!.y + y - this.value.scrollY!;

    let contentHeight = 0;

    for (const row of rows) {
      let maxHeight = 0;
      for (const child of row) {
        maxHeight = Math.max(maxHeight, child.getBoxModelSize().height);
      }
      contentHeight += maxHeight;
    }

    const verticalGap = this.value.gap ?? 0;
    const totalGapHeight = verticalGap * (rows.length - 1);
    contentHeight += totalGapHeight;

    const containerHeight = this.value.size?.height ?? Infinity;
    const spaceLeftY = containerHeight - contentHeight;

    switch (this.value.align) {
      case "center":
        offsetY += spaceLeftY / 2;
        break;
      case "bottom":
        offsetY += spaceLeftY;
        break;
      case "top":
        break;
      default:
        console.warn(
          `[Alignment Warning] Invalid value for "alignY": "${
            this.value.justify
          }" on element "${
            this.value.id ?? this.value.name ?? "unknown"
          }". Expected one of: "top", "center", "bottom", "space-between", "space-around", or "space-evenly". Defaulting to "top".\nStack Trace:\n${
            new Error().stack
          }`
        );
        break;
    }

    for (const row of rows) {
      let totalContentWidth = 0;
      let rowHeight = 0;

      for (const child of row) {
        const size = child.getBoxModelSize();
        totalContentWidth += size.width;
        rowHeight = Math.max(rowHeight, size.height);
      }

      const numGaps = row.length - 1;
      totalContentWidth += gap * numGaps;
      const spaceLeft = containerWidth - totalContentWidth;
      let offsetX = this.value.position!.x + x - this.value.scrollX!;
      let spacing = gap;

      switch (this.value.justify) {
        case "center":
          offsetX += spaceLeft / 2;
          break;
        case "right":
          offsetX += spaceLeft;
          break;
        case "space-between":
          spacing = row.length > 1 ? spaceLeft / numGaps : 0;
          break;
        case "space-around":
          spacing = spaceLeft / row.length;
          offsetX += spacing / 2;
          break;
        case "space-evenly":
          spacing = spaceLeft / (row.length + 1);
          offsetX += spacing;
          break;
        case "left":
          break;
        default:
          console.warn(
            `[Alignment Warning] Invalid value for "alignX": "${
              this.value.align
            }" on element "${
              this.value.id ?? this.value.name ?? "unknown"
            }". Expected one of: "left", "center", "right", "space-between", "space-around", or "space-evenly". Defaulting to "left".\nStack Trace:\n${
              new Error().stack
            }`
          );
          break;
      }

      for (const child of row) {
        const size = child.getBoxModelSize();
        child.value.position = { x: offsetX, y: offsetY };
        child.draw(ctx);
        offsetX += size.width + spacing;
      }

      offsetY += rowHeight + gap;
    }
  }

  public override isScrollable(): boolean {
    return true;
  }
}
