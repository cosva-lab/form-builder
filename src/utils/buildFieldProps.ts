import type {
  PropsField,
  FieldType,
  NameField,
  CommonValidations,
} from '../types';

export function buildFieldProps<
  Value,
  Name extends NameField,
  Validations extends
    | CommonValidations<FieldType<Name, Value, any>>
    | undefined,
>(
  field: PropsField<FieldType<Name, Value, Validations>>,
): PropsField<FieldType<Name, Value, Validations>> {
  return field;
}
