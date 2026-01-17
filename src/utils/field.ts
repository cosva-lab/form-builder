import type {
  PropsField,
  FieldType,
  NameField,
  CommonValidations,
} from '../types';
import { FieldBuilder } from './builders/FieldBuilder';

export function field<Name extends NameField, Value>(
  field: PropsField<FieldType<Name, Value>, undefined>,
): FieldBuilder<FieldType<Name, Value>, undefined>;

export function field<
  Name extends NameField,
  Value,
  V extends CommonValidations,
>(
  field: PropsField<FieldType<Name, Value>, V>,
): FieldBuilder<FieldType<Name, Value>, V>;

export function field(field: any) {
  return new FieldBuilder(field);
}
