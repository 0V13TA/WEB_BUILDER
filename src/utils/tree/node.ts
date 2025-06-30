export type NodeJson<T> = {
  value: T;
  children: NodeJson<T>[];
};

export class Node<T, C extends Node<any, any> = Node<T, any>> {
  public value: T;
  protected readonly children: C[] = [];

  constructor(value: T) {
    this.value = value;
  }

  public addChild(child: C): void {
    this.children.push(child);
  }

  public getChildren(): C[] {
    return this.children;
  }

  public getValue(): T {
    return this.value;
  }

  public setValue(value: T): void {
    this.value = value;
  }

  public hasChildren(): boolean {
    return this.children.length > 0;
  }

  public removeChild(child: C): void {
    const index = this.children.indexOf(child);
    if (index !== -1) this.children.splice(index, 1);
  }

  public clearChildren(): void {
    this.children.length = 0;
  }

  public toString(): string {
    return `Node(value: ${this.value}, children: [${this.children
      .map((child) => child.toString())
      .join(", ")}])`;
  }

  public toJson(): object {
    return {
      value: this.value,
      children: this.children.map((child) => child.toJson())
    };
  }

  static fromJson<T>(json: NodeJson<T>): Node<T> {
    const node = new Node<T>(json.value);
    for (const childData of json.children) {
      node.addChild(Node.fromJson(childData));
    }
    return node;
  }
}
