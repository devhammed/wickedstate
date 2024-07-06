export function textDirective({ node, value }): void {
  node.textContent = value;
}
