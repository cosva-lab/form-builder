import type {
  PropsField,
  FieldType,
  NameField,
  CommonValidations,
} from '../types';

export function buildFieldProps<Name extends NameField, Value>(
  field: PropsField<FieldType<Name, Value, undefined>>,
): PropsField<FieldType<Name, Value, undefined>>;

export function buildFieldProps<
  Name extends NameField,
  Value,
  V extends CommonValidations<FieldType<Name, Value>>,
>(
  field: PropsField<FieldType<Name, Value, V>>,
): PropsField<FieldType<Name, Value, V>>;

export function buildFieldProps<
  Name extends NameField,
  Value,
  V extends CommonValidations<FieldType<Name, Value>> | undefined,
>(
  field: PropsField<FieldType<Name, Value, V>>,
): PropsField<FieldType<Name, Value, V>> {
  return field;
}
