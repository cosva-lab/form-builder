import type {
  PropsField,
  FieldType,
  NameField,
  CommonValidations,
} from '../types';

export function buildFieldProps<
  Value,
  const Name extends NameField,
  const Validations extends CommonValidations<any> | undefined,
>(
  field: PropsField<FieldType<Name, Value, Validations>>,
): PropsField<FieldType<Name, Value, Validations>> {
  return field as any;
}
