export function serialize(val: any) {
  return JSON.stringify(val, (_key, value) => {
    // if function, serialize it to string to avoid loss of data...
    if (typeof value === 'function') {
      return value.toString();
    }

    // else default to json serialization...
    return value;
  });
}
