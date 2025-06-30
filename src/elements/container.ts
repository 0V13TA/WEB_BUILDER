import Element from "./element";
import type { ElementType } from "../utils/types";

export default class Container<
  T extends ElementType = ElementType
> extends Element<T> {
  constructor(value: T, pos?: { x: number; y: number }) {
    pos ? super(value, pos) : super(value);
  }

  protected computeChildrenMetrics(): void {
    throw new Error("The get children size method must be implemented.");
  }

  public layoutChildren(_ctx: CanvasRenderingContext2D) {
    throw new Error("The align children method must be implemented.");
  }
}
