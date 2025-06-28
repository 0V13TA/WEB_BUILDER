import Vbox from "./elements/vbox";
import type { ElementType } from "./utils/types";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
document.body.append(canvas);

addEventListener("load", init);
addEventListener("resize", init);

function init() {
  // Resize the canvas
  const ratio = 0.99;
  canvas.height = innerHeight * ratio;
  canvas.width = innerWidth * ratio;

  //

  const element: ElementType = {
    type: "vbox",
    background: {
      color: [0, 0, 255, 1]
    },
    fixedSize: {
      width: 200,
      height: 200
    },
    position: {
      x: 0,
      y: 0
    },
    outline: {
      width: 4,
      style: "solid",
      color: [255, 0, 0, 1]
    },
    margin: {
      top: 10,
      left: 10,
      right: 10,
      bottom: 10
    },
    padding: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    childGap: 10
  };

  const element2: ElementType = {
    type: "vbox",
    background: {
      color: [0, 255, 0, 1]
    },
    fixedSize: {
      width: 100,
      height: 100
    }
  };

  const container = new Vbox(element);
  container.draw(ctx);
  container.addChild(new Vbox(element2));
  container.addChild(new Vbox(element2));
  container.alignChildren(ctx);
}
