import Vbox from "./elements/vbox";
import type { ContainerType } from "./utils/types";

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

  const element: ContainerType = {
    type: "vbox",
    wrap: false,
    background: {
      color: [0, 0, 255, 1]
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
    margin: 10,
    padding: 0,
    childGap: 5
  };

  const element2: ContainerType = {
    type: "vbox",
    background: {
      color: [0, 255, 0, 1]
    },
    fixedSize: {
      width: 100,
      height: 100
    },
    wrap: false
  };

  const child2: ContainerType = {
    type: "vbox",
    background: {
      color: [255, 0, 255, 1]
    },
    margin: 0,
    padding: [0, 0, 0, 10],
    wrap: true,
    childGap: 10
  };

  const container = new Vbox(element);
  const subChild = new Vbox(child2);
  subChild.addChild(new Vbox(element2));
  subChild.addChild(new Vbox(element2));
  for (let i = 0; i < 3; i++) {
    container.addChild(new Vbox(element2));
  }
  container.addChild(subChild);

  console.log("Container:", container.computeModalSize());
  console.log("subChild:", subChild.computeModalSize());

  container.draw(ctx);
}
