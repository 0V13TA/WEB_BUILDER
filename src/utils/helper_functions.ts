export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void {
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fill();
  ctx.closePath();
}
