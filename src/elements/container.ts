import Element from "./element";
import type { ElementType } from "../utils/types";

export default class Container extends Element {

  constructor(value: ElementType) {
    super(value);
  }

  alignChildren() {
    throw new Error("The align children method must be implemented.");
  }
}
