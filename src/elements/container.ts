import type { ElementType } from "../utils/types";
import Element from "./element";

export default class Container extends Element {
  constructor(value: ElementType) {
    super(value);
  }

  alignChildren() {
    throw new Error("The align children method must be implemented.");
  }
}
