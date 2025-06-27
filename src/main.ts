import Vbox from "./elements/vbox";
import type { ElementType } from "./utils/types";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.height = innerHeight;
canvas.width = innerWidth;
document.body.append(canvas);

const element: ElementType = {
  type: "vbox",
  color: [10, 10, 10, 1],
  background: {
    color: [0, 0, 255, 1]
  },
  fixedSize: {
    width: 200,
    height: 200
  }
};



const container = new Vbox(element);
container.draw(ctx);
container.value.background.color = [25, 25, 255, 1];
container.draw(ctx);
