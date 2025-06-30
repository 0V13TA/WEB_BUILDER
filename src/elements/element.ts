import { Node } from "../utils/tree/node";
import type { ElementType } from "../utils/types";

const defaultColor: [number, number, number, number] = [0, 0, 0, 1];

export const defaultElementType: ElementType = {
  min: { width: 0, height: 0 },
  max: { width: Infinity, height: Infinity },
  id: "",
  color: defaultColor,
  name: "",
  video: "",
  fixedSize: { width: 100, height: 100 },
  visible: true,
  type: "element",
  margin: 0,
  padding: 0,
  outline: undefined,
  meta: {},
  position: { x: 0, y: 0 },
  borderRadius: {
    topLeft: 0,
    topRight: 0,
    bottomLeft: 0,
    bottomRight: 0
  },
  background: {
    color: [255, 255, 255, 1],
    imageSize: undefined,
    imageSrc: undefined,
    linearGradient: undefined,
    radialGradient: undefined
  }
};

export default class Element extends Node<ElementType> {
  value: ElementType;

  constructor(value: Partial<ElementType>) {
    super({ ...defaultElementType, ...value });
    this.value = { ...defaultElementType, ...value };
  }

  addChild(child: Element): void {
    super.addChild(child);
  }

  getChildren(): Element[] {
    return super.getChildren() as Element[];
  }
}
