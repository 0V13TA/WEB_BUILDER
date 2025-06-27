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

function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fill();
  ctx.closePath();
}

const container = new Vbox(element);
container.draw(ctx);
clearCanvas(ctx);
container.value.background.color = [2, 0, 0, 0.1];
container.draw(ctx);
