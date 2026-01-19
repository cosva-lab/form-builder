import type {
  PropsField,
  FieldType,
  Simplify,
  CommonValidations,
  NameField,
} from '../types';
import { FieldBuilder } from './builders/FieldBuilder';

export function buildField<
  V,
  const N extends NameField,
  Validations extends CommonValidations<V> | undefined,
  L,
>(
  field: PropsField<FieldType<N, V, Validations, L>>,
): FieldBuilder<Simplify<FieldType<N, V, Validations, L>>> {
  return new FieldBuilder(field as any) as any;
}
