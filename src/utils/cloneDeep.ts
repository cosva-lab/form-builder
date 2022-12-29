
export const cloneDeep = <V>(value: V): V => JSON.parse(JSON.stringify(value));
