import { Node } from "../utils/tree/node";
import { type ElementType } from "../utils/types";

export default class Element extends Node<ElementType> {
  constructor(value: ElementType) {
    super(value);
  }

  draw(_ctx: CanvasRenderingContext2D) {
    throw new Error("The draw method must be implemented.");
  }
}
