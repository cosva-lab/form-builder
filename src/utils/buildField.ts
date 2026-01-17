import type {
  PropsField,
  FieldType,
  NameField,
  CommonValidations,
} from '../types';
import { FieldBuilder } from './builders/FieldBuilder';

export function buildField<
  Value,
  Name extends NameField,
  Validations extends
    | CommonValidations<FieldType<Name, Value, any>>
    | undefined,
>(
  field: PropsField<FieldType<Name, Value, Validations>>,
): FieldBuilder<FieldType<Name, Value, Validations>> {
  return new FieldBuilder(field);
}
