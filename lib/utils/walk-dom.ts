export function walkDom<T>(
    nodes: Node | NodeList,
    fn: (node: Node) => T | undefined,
): T | undefined {
  let walkingNodes: Node[] =
      ('length' in nodes) ? [].slice.call(nodes) : [nodes];

  while (walkingNodes.length) {
    const node = walkingNodes.shift();

    const ret = fn(node);

    if (ret) {
      return ret;
    }

    if (node?.childNodes?.length > 0) {
      walkingNodes = [].slice.call(node.childNodes).concat(walkingNodes);
    }
  }
}
