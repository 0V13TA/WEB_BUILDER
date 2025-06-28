import Element from "./element";
import type { ElementType } from "../utils/types";

export default class Container extends Element {
  constructor(value: ElementType, pos?: { x: number; y: number }) {
    pos ? super(value, pos) : super(value);
  }

  public alignChildren(_ctx: CanvasRenderingContext2D) {
    throw new Error("The align children method must be implemented.");
  }
}
