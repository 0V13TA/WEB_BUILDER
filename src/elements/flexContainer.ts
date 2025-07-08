import Element from "./element";
import type { ElementType } from "../utils/types";
import { rgbaToHex } from "../utils/colorUtils";

export default class FlexContainer extends Element {
  constructor(value: Partial<ElementType>) {
    super({ ...value, type: "flexContainer", name: "flexContainer" });
  }

  public draw(_ctx: CanvasRenderingContext2D): void {
    if ((this.value.fitHeight || this.value.fitWidth) && this.value.grows)
      console.warn(
        `[Layout Conflict] Element "${
          this.value.name ?? this.value.id ?? "unknown"
        }" has both "fixed: true" and "grows: true". Ignoring "grows".\nStack Trace:\n${
          new Error().stack
        }`
      );

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

    this.calculateGrowSize(rows, "horizontal");

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
        break;
      case undefined:
        break;
      default:
        console.warn(
          `[Alignment Warning] Invalid value for "align": "${
            this.value.align
          }" on element "${this.value.id ?? this.value.name ?? "unknown"}". ` +
            `Expected one of: "start", "center", or "end". Defaulting to "start".\nStack Trace:\n${
              new Error().stack
            }`
        );
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

    this.calculateGrowSize(columns, "vertical");

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

  private calculateGrowSize(
    layoutGroups: Element[][],
    direction: "horizontal" | "vertical"
  ): void {
    const isHorizontal = direction === "horizontal";
    const containerSize = isHorizontal
      ? this.value.size?.width ?? Infinity
      : this.value.size?.height ?? Infinity;

    const gap = this.value.gap ?? 0;

    for (const group of layoutGroups) {
      const growables = group.filter((el) => el.value.grows === true);
      if (growables.length === 0) continue;

      // Calculate total size used by non-grow elements
      let usedSpace = 0;
      for (const el of group) {
        if (el.value.grows !== true) {
          const size = el.getBoxModelSize();
          const dimension = isHorizontal ? size.width : size.height;
          usedSpace += Number.isFinite(dimension) ? dimension : 0;
        }
      }

      const totalGap = (group.length - 1) * gap;
      const availableSpace = containerSize - usedSpace - totalGap;

      if (!isFinite(availableSpace) || availableSpace <= 0) {
        console.warn(`[Grow Warning] No available space to grow in group.`);
        continue;
      }

      const growSize = availableSpace / growables.length;

      if (!isFinite(growSize) || growSize <= 0) {
        console.warn(`[Grow Warning] Invalid grow size: ${growSize}`);
        continue;
      }

      for (const el of growables) {
        const minSize = isHorizontal
          ? el.value.min?.width ?? 1
          : el.value.min?.height ?? 1;

        if (!Number.isFinite(minSize) || minSize <= 0) {
          console.warn(
            `[Grow Warning] Element "${
              el.value.id ?? el.value.name ?? "unknown"
            }" is set to grow but has no valid minimum size defined.\nStack Trace:\n${
              new Error().stack
            }`
          );
        }

        el.value.size ??= {};

        if (isHorizontal) {
          el.value.size.width = Math.max(minSize, growSize);
        } else {
          el.value.size.height = Math.max(minSize, growSize);
        }

        // Optional debug logging
        console.log(
          `[Grow Assigned] ${el.value.name ?? el.value.id ?? "?"}: ${
            isHorizontal ? el.value.size.width : el.value.size.height
          }px`
        );
      }
    }
  }

  public override isScrollable(): boolean {
    return true;
  }
}
