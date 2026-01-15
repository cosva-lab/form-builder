export enum StatusField {
  // This control has passed all validation checks.
  VALID = 'VALID',
  // This control has failed at least one validation check.
  INVALID = 'INVALID',
  // This control is in the midst of conducting a validation check.
  PENDING = 'PENDING',
}
