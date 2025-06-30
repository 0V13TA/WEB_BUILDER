import Element from "./element";
import type { ElementType } from "../utils/types";

export default class FlexContainer extends Element {
  constructor(value: Partial<ElementType>) {
    super({ ...value, type: "flexContainer" });
  }
}
