import type { PropsField, FieldType } from '../types';
import { FieldBuilder } from './builders/FieldBuilder';

export const field = <Name extends PropertyKey, Value>(
  field: PropsField<FieldType<Name, Value>>,
): FieldBuilder<PropsField<FieldType<Name, Value>>> =>
  new FieldBuilder(field);
