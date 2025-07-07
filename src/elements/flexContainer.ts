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
    switch (this.value.flexDirection) {
      case "column":
        this.verticalAlign(_ctx);
        break;
      case "row":
        this.horizontalAlign(_ctx);
        break;
      default:
        this.horizontalAlign(_ctx);
    }
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

    return rows;
  }

  private getChildrenSizesColumn(): Element[][] {
    const column: Element[][] = [];
    let currentColumn: Element[] = [];
    let currentHeight = 0;

    const children = this.getChildren();
    const containerHeight = this.value.size?.height ?? Infinity;
    const gap = this.value.gap ?? 0;

    for (const child of children) {
      const childHeight = child.getBoxModelSize().height;

      const totalHeight =
        currentColumn.length > 0
          ? currentHeight + gap + childHeight
          : childHeight;

      if (
        this.value.flexWrap === "wrap" &&
        totalHeight > containerHeight &&
        currentColumn.length > 0
      ) {
        column.push(currentColumn);
        currentColumn = [child];
        currentHeight = childHeight;
      } else {
        currentColumn.push(child);
        currentHeight = totalHeight;
      }
    }

    if (currentColumn.length > 0) {
      column.push(currentColumn);
    }

    return column;
  }

  private horizontalAlign(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.getBoxModelOffset();
    const rows = this.getChildrenSizesRow();
    const gap = this.value.gap ?? 0;
    const containerWidth = this.value.size?.width ?? Infinity;

    let offsetY = this.value.position!.y + y - this.value.scrollY!;

    // Calculate total content height for vertical alignment
    let contentHeight = 0;
    for (const row of rows) {
      let maxHeight = 0;
      for (const child of row) {
        maxHeight = Math.max(maxHeight, child.getBoxModelSize().height);
      }
      contentHeight += maxHeight;
    }
    contentHeight += gap * (rows.length - 1);

    // Apply vertical alignment
    const spaceLeftY = this.value.size?.height! - contentHeight;
    switch (this.value.align) {
      case "center":
        offsetY += spaceLeftY / 2;
        break;
      case "end":
        offsetY += spaceLeftY;
        break;
      case "start":
      default:
        break;
    }

    for (const row of rows) {
      let totalRowWidth = 0;
      let rowHeight = 0;

      // Calculate total width of all elements in row
      for (const child of row) {
        const size = child.getBoxModelSize();
        totalRowWidth += size.width;
        rowHeight = Math.max(rowHeight, size.height);
      }

      const numGaps = row.length > 1 ? row.length - 1 : 0;
      const totalGapsWidth = gap * numGaps;
      const totalContentWidth = totalRowWidth + totalGapsWidth;
      const availableSpace = containerWidth - totalContentWidth;

      let offsetX = this.value.position!.x + x - this.value.scrollX!;
      let spacing = gap;

      // Apply horizontal justification
      switch (this.value.justify) {
        case "center":
          offsetX += availableSpace / 2;
          break;
        case "end":
          offsetX += availableSpace;
          break;
        case "space-between":
          if (row.length > 1) {
            spacing = (containerWidth - totalRowWidth) / (row.length - 1);
          }
          break;
        case "space-around":
          spacing = (containerWidth - totalRowWidth) / row.length;
          offsetX += spacing / 2;
          break;
        case "space-evenly":
          spacing = (containerWidth - totalRowWidth) / (row.length + 1);
          offsetX += spacing;
          break;
        case "start":
        default:
          break;
      }

      // Position and draw each child in the row
      for (const child of row) {
        const size = child.getBoxModelSize();
        child.value.position = { x: offsetX, y: offsetY };
        child.draw(ctx);
        offsetX += size.width + spacing;
      }

      offsetY += rowHeight + gap;
    }
  }

  private verticalAlign(ctx: CanvasRenderingContext2D) {
    const gap = this.value.gap ?? 0;
    const { x, y } = this.getBoxModelOffset();
    const columns = this.getChildrenSizesColumn();
    const containerWidth = this.value.size?.width ?? Infinity;
    const containerHeight = this.value.size?.height ?? Infinity;

    let offsetX = this.value.position!.x + x - this.value.scrollX!;

    // Calculate total content width for horizontal alignment
    let contentWidth = 0;
    for (const column of columns) {
      let maxWidth = 0;
      for (const child of column) {
        maxWidth = Math.max(maxWidth, child.getBoxModelSize().width);
      }
      contentWidth += maxWidth;
    }
    contentWidth += gap * (columns.length - 1);

    // Apply horizontal alignment
    const spaceLeftX = containerWidth - contentWidth;
    switch (this.value.align) {
      case "center":
        offsetX += spaceLeftX / 2;
        break;
      case "end":
        offsetX += spaceLeftX;
        break;
      case "start":
      default:
        break;
    }

    for (const column of columns) {
      let totalColumnHeight = 0;
      let columnWidth = 0;

      // Calculate total height of all elements in column
      for (const child of column) {
        const size = child.getBoxModelSize();
        totalColumnHeight += size.height;
        columnWidth = Math.max(columnWidth, size.width);
      }

      const numGaps = column.length > 1 ? column.length - 1 : 0;
      const totalGapsHeight = gap * numGaps;
      const totalContentHeight = totalColumnHeight + totalGapsHeight;
      const availableSpace = containerHeight - totalContentHeight;

      let offsetY = this.value.position!.y + y - this.value.scrollY!;
      let spacing = gap;

      // Apply vertical justification
      switch (this.value.justify) {
        case "center":
          offsetY += availableSpace / 2;
          break;
        case "end":
          offsetY += availableSpace;
          break;
        case "space-between":
          if (column.length > 1) {
            spacing =
              (containerHeight - totalColumnHeight) / (column.length - 1);
          }
          break;
        case "space-around":
          spacing = (containerHeight - totalColumnHeight) / column.length;
          offsetY += spacing / 2;
          break;
        case "space-evenly":
          spacing = (containerHeight - totalColumnHeight) / (column.length + 1);
          offsetY += spacing;
          break;
        case "start":
        default:
          break;
      }

      // Position and draw each child in the column
      for (const child of column) {
        const size = child.getBoxModelSize();
        child.value.position = { x: offsetX, y: offsetY };
        child.draw(ctx);
        offsetY += size.height + spacing;
      }

      offsetX += columnWidth + gap;
    }
  }

  public override isScrollable(): boolean {
    return true;
  }
}
