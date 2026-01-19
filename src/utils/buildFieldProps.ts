import type {
  PropsField,
  FieldType,
  CommonValidations,
  NameField,
} from '../types';

export function buildFieldProps<
  V,
  const N extends NameField,
  Validations extends CommonValidations<V> | undefined,
  L,
>(
  field: PropsField<FieldType<N, V, Validations, L>>,
): PropsField<FieldType<N, V, Validations, L>> & {
  validations: Validations;
} {
  return field as any;
}
