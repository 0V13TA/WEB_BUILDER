import FlexContainer from "./elements/flexContainer";
import colorMap from "./utils/colors";
import type { ElementType } from "./utils/types";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
document.body.append(canvas);
const ratio = 0.9;
canvas.width = innerWidth * ratio;
canvas.height = innerHeight * ratio;

addEventListener("load", init);
addEventListener("resize", init);

function init() {
  // Resize the canvas
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;

  //

  const flexValue: ElementType = {
    gap: 5,
    margin: 0,
    padding: 10,
    align: "start",
    grows: false,
    flexWrap: "wrap",
    scrollable: true,
    justify: "center",
    flexDirection: "row",
    background: { color: colorMap.aquamarine },
    size: { width: canvas.width, height: canvas.height }
  };

  const child: ElementType = {
    margin: 0,
    grows: true,
    size: { width: 100, height: 100 },
    background: { color: colorMap.brown }
  };

  const child1: ElementType = {
    min: { width: 10 },
    margin: 0,
    size: { width: 100, height: 100 },
    background: { color: colorMap.burlywood }
  };

  const child2: ElementType = {
    margin: 0,
    size: { width: 100, height: 100 },
    background: { color: colorMap.blanchedalmond }
  };

  const flexBox = new FlexContainer(flexValue);
  const childFlex = new FlexContainer(child);
  const child1Flex = new FlexContainer(child1);
  const child2Flex = new FlexContainer(child2);

  //

  const children = [
    child2Flex,
    childFlex,
    child1Flex,
    child2Flex,
    childFlex,
    child1Flex,
    child2Flex,
    child1Flex,
    childFlex,
    child1Flex
  ];

  for (const child of children) {
    flexBox.addChild(child);
  }

  flexBox.draw(ctx);
}
