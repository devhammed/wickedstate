export function onDirective({ node, value }): void {
    if (Object.prototype.toString.call(value) !== '[object Object]') {
        throw new Error(`[WickedState] Event listeners must be an object for ${node}`);
    }
}
