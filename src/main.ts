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
    margin: 0,
    padding: 0,
    size: { width: canvas.width, height: canvas.height },
    background: {
      color: colorMap.chocolate
    },
    gap: 5,
    grows: false,
    scrollable: true,
    flexWrap: "wrap"
  };

  const child: ElementType = {
    background: {
      color: colorMap.black
    },
    size: {
      width: 100,
      height: 100
    },
    margin: 0
  };

  const child1: ElementType = {
    background: {
      color: colorMap.blue
    },
    size: {
      width: 100,
      height: 100
    },
    margin: 0
  };

  const child2: ElementType = {
    background: {
      color: colorMap.blanchedalmond
    },
    size: {
      width: 100,
      height: 100
    },
    margin: 0
  };

  //
  const flexBox = new FlexContainer(flexValue);

  for (let i = 0; i < 4; i++) {
    const childFlex = new FlexContainer(child);
    flexBox.addChild(childFlex);

    const child1Flex = new FlexContainer(child1);
    flexBox.addChild(child1Flex);

    const child2Flex = new FlexContainer(child2);
    flexBox.addChild(child2Flex);
  }

  flexBox.draw(ctx);
}
