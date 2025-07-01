import FlexContainer from "./elements/flexContainer";
import colorMap from "./utils/colors";
import type { ElementType } from "./utils/types";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
document.body.append(canvas);
const ratio = 0.997;
canvas.width = innerWidth * ratio;
canvas.height = innerHeight * ratio;

addEventListener("load", init);
addEventListener("resize", init);

function init() {
  // Resize the canvas
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;

  const flexValue: ElementType = {
    margin: [10, 2],
    padding: 20,
    background: {
      color: colorMap.chocolate
    },
    border: {
      width: 6,
      color: colorMap.darkkhaki,
      style: "solid",
      gap: 5
    },
    gap: 10,
    grows: true
  };

  const child: ElementType = {
    background: {
      color: colorMap.gainsboro
    },
    size: {
      width: 200,
      height: 200
    },
    margin: 20
  };

  //
  const flexBox = new FlexContainer(flexValue);
  canvas.addEventListener("wheel", (e) => {
    flexBox.handleEvent(e);
    console.log("Moving");
  });

  for (let i = 0; i < 1; i++) {
    const childFlex = new FlexContainer(child);
    flexBox.addChild(childFlex);
  }
  flexBox.draw(ctx);
}
