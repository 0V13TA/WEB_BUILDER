import { Element, type elementType } from "./element";

export type textElementType = elementType & {
  content: string;
};

export class TextElement extends Element {
  content: string;

  constructor(props: textElementType) {
    super(props);
    this.content = props.content;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.font = this.styles["font"] || "16px Arial";
    ctx.fillStyle = this.styles["color"] || "#000";
    ctx.textAlign = (this.styles["textAlign"] || "left") as CanvasTextAlign;
    ctx.textBaseline = (this.styles["textBaseline"] || "top") as CanvasTextBaseline;

    ctx.fillText(this.content, this.position.x, this.position.y);
  }
}
