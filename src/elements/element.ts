export type elementType = {
  id?: string;
  type: string;
  size?: { width: number; height: number };
  position?: { x: number; y: number };
  styles: Record<string, string>;
};

export class Element {
  id: string;
  type: string;
  size: { width: number; height: number };
  position: { x: number; y: number };
  styles: Record<string, string>;

  constructor(props: elementType) {
    this.id = props.id ?? `el-${Date.now()}`;
    this.type = props.type;
    this.size = {
      width: props.size?.width ?? 100,
      height: props.size?.height ?? 100
    };
    this.position = {
      x: props.position?.x ?? 0,
      y: props.position?.y ?? 0
    };
    this.styles = props.styles;
  }

  render(_ctx: CanvasRenderingContext2D): void {
    throw new Error("The render method in element class must be implemented");
  }

  toJson() {
    return {
      id: this.id,
      type: this.type,
      size: this.size,
      position: this.position,
      styles: this.styles
    };
  }
}
