export async function start(): Promise<void> {
  const directiveRegex = /\*(?<name>[\w-]+)(?:\[(?<tag>[^\]]*)\])?.?(?<modifiers>(?:[\w-]+(?:\[[^\]]*\])?(?:\.[\w-]+(?:\[[^\]]*\])?)*)?)?/;

  const modifiersRegex = /(?<name>[\w-]+)(?:\[(?<args>[^\]]*)\])?/;

  const walkingNodes: Node[] = [document.body];

  while (walkingNodes.length) {
    const node = walkingNodes.shift();

    if (node?.childNodes?.length > 0) {
      walkingNodes.unshift.apply(
          walkingNodes,
          [].slice.call(node.childNodes),
      );
    }

    // Process the node
  }
}
