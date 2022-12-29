export const isEmpty = (value: any) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object')
    return Object.keys(value).length === 0;
  return false;
};
