export function evaluate<T>(expr: string, context: object): T {
  const accessor = new Function(
      'context',
      `
        return (function() {
          with (context) {
            return ${expr};
          }
        })();
      `,
  );

  return accessor.call(context, context);
}
