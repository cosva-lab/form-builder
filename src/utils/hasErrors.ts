export const hasErrors = (errors: unknown): errors is unknown[] =>
  Array.isArray(errors) && errors.length > 0;
