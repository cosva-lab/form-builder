import type { PropsField, FieldType, NameField } from '../types';
import { FieldBuilder } from './builders/FieldBuilder';

export function field<Name extends NameField, Value>(
  field: PropsField<FieldType<Name, Value>>,
) {
  return new FieldBuilder(field);
}
