import Element from "./element";
import type { ContainerType } from "../utils/types";

export default class Container extends Element<ContainerType> {
  constructor(value: ContainerType, pos?: { x: number; y: number }) {
    pos ? super(value, pos) : super(value);
  }

  public getChildrenSize(): [number, number] {
    const children = this.getChildren();
    const outline = this.value.outline?.width ?? 0;
    let totalHeight = 0,
      totalWidth = 0;

    for (const child of children) {
      const [width, height] = child.computeModalSize();
      totalHeight += height;
      totalWidth = Math.max(totalWidth, width);
    }

    totalHeight +=
      (this.value?.childGap ?? 0) * (children.length - 1) + outline;
    totalWidth += outline;

    if (this.value.fixedSize)
      this.size = {
        width: this.value.fixedSize.width ?? totalWidth,
        height: this.value.fixedSize.height ?? totalHeight
      };
    else
      this.size = {
        width: totalWidth,
        height: totalHeight
      };

    return [totalWidth, totalHeight];
  }

  public alignChildren(_ctx: CanvasRenderingContext2D) {
    throw new Error("The align children method must be implemented.");
  }
}
