import { TextElement, type textElementType } from "./elements/textElement";
const body = document.querySelector<HTMLDivElement>("#app");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
body?.appendChild(canvas);

canvas.width = innerWidth * 0.9;
canvas.height = innerHeight - 50;

let centerPos = {
  x: canvas.width / 2,
  y: canvas.height / 2
};

addEventListener("load", init);
addEventListener("resize", init);

function init() {
  canvas.width = innerWidth * 0.9;
  canvas.height = innerHeight - 50;
  centerPos = {
    x: canvas.width / 2,
    y: canvas.height / 2
  };
  const textElement: textElementType = {
    id: "text-1",
    type: "text",
    size: { width: 200, height: 50 },
    position: { x: centerPos.x - 100, y: centerPos.y - 25 },
    styles: {
      font: "20px Arial",
      color: "#333"
    },
    content: "Hello, Canvas!"
  };
  const text = new TextElement(textElement);
  text.render(ctx!);
}
