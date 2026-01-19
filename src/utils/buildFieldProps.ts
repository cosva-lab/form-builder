import type {
  PropsField,
  FieldType,
  CommonValidations,
} from '../types';

export function buildFieldProps<
  V,
  Validations extends CommonValidations<V> | undefined,
  const P extends PropsField<FieldType<any, V, Validations, any>>,
>(
  field: P & { value: V; validations?: Validations },
): P &
  (P['validations'] extends CommonValidations<V>
    ? { validations: P['validations'] }
    : { validations: unknown }) {
  return field as any;
}
