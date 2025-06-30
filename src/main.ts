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
  ctx.fillStyle = "white";
}
