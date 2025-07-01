import FlexContainer from "./elements/flexContainer";
import type { ElementType } from "./utils/types";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
document.body.append(canvas);

addEventListener("load", init);
addEventListener("resize", init);

function init() {
  // Resize the canvas
  const ratio = 0.99;
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;

  const flexValue: ElementType = {
    margin: 2,
    padding: 0,
    background: {
      color: [255, 0, 0, 1]
    },
    border: {
      width: 5,
      color: [0, 200, 0, 1],
      style: "solid",
      gap: 5
    },
    borderRadius: 10
  };

  //
  const flexBox = new FlexContainer(flexValue);
  flexBox.draw(ctx);
}
